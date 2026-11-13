package Football.Hub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;

@Service
public class SportsDbService {

    private static final long CACHE_TTL_MILLIS = 30 * 60 * 1000L;
    private static final long STALE_CACHE_TTL_MILLIS = 24 * 60 * 60 * 1000L;
    private static final long MIN_REQUEST_INTERVAL_MILLIS = 2200L;
    private static final long RATE_LIMIT_COOLDOWN_MILLIS = 60 * 1000L;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final Map<String, CachedResponse> responseCache = new HashMap<>();

    private long lastRequestAt;
    private long blockedUntil;

    // The public free key is shared. Set SPORTSDB_API_KEY to a paid key later.
    public SportsDbService(
            @Value("${SPORTSDB_API_KEY:123}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl("https://www.thesportsdb.com/api/v1/json/" + apiKey)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public synchronized JsonNode searchPlayers(String name) {
        if (name == null || name.isBlank()) {
            return objectMapper.createObjectNode().putNull("player");
        }

        String query = name.trim();
        String cacheKey = query.toLowerCase(Locale.ROOT);
        long now = System.currentTimeMillis();
        CachedResponse cached = responseCache.get(cacheKey);

        if (cached != null && now < cached.expiresAt) {
            return readCachedResponse(cached.json);
        }

        if (now < blockedUntil) {
            if (cached != null && now < cached.staleUntil) {
                return readCachedResponse(cached.json);
            }

            throw new IllegalStateException(
                    "TheSportsDB is temporarily rate-limiting searches. " +
                    "Please wait a little and try again.");
        }

        waitForRequestSlot();

        try {
            String response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/searchplayers.php")
                            .queryParam("p", query)
                            .build())
                    .retrieve()
                    .body(String.class);

            JsonNode result = objectMapper.readTree(response);
            long savedAt = System.currentTimeMillis();

            responseCache.put(cacheKey, new CachedResponse(
                    response,
                    savedAt + CACHE_TTL_MILLIS,
                    savedAt + STALE_CACHE_TTL_MILLIS
            ));

            removeExpiredCacheEntries(savedAt);
            return result;

        } catch (RestClientResponseException e) {
            String responseBody = e.getResponseBodyAsString();
            boolean rateLimited = e.getStatusCode().value() == 429 ||
                    responseBody.contains("1015");

            if (rateLimited) {
                blockedUntil = System.currentTimeMillis()
                        + RATE_LIMIT_COOLDOWN_MILLIS;

                if (cached != null &&
                        System.currentTimeMillis() < cached.staleUntil) {
                    return readCachedResponse(cached.json);
                }

                throw new IllegalStateException(
                        "TheSportsDB is temporarily rate-limiting searches. " +
                        "Previously found players can still be used. " +
                        "Please wait a little before searching for new players.",
                        e
                );
            }

            throw new IllegalStateException(
                    "TheSportsDB returned an error: " + e.getStatusCode(),
                    e
            );

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Player search was interrupted. Please try again.",
                    e
            );

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Unable to reach TheSportsDB: " + e.getMessage(),
                    e
            );
        }
    }

    private void waitForRequestSlot() throws InterruptedException {
        long waitTime = MIN_REQUEST_INTERVAL_MILLIS -
                (System.currentTimeMillis() - lastRequestAt);

        if (waitTime > 0) {
            Thread.sleep(waitTime);
        }

        lastRequestAt = System.currentTimeMillis();
    }

    private JsonNode readCachedResponse(String response) {
        try {
            return objectMapper.readTree(response);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Could not read the cached player search.",
                    e
            );
        }
    }

    private void removeExpiredCacheEntries(long now) {
        Iterator<Map.Entry<String, CachedResponse>> iterator =
                responseCache.entrySet().iterator();

        while (iterator.hasNext()) {
            if (now >= iterator.next().getValue().staleUntil) {
                iterator.remove();
            }
        }

        if (responseCache.size() > 500) {
            responseCache.clear();
        }
    }

    private static class CachedResponse {
        private final String json;
        private final long expiresAt;
        private final long staleUntil;

        private CachedResponse(
                String json,
                long expiresAt,
                long staleUntil) {
            this.json = json;
            this.expiresAt = expiresAt;
            this.staleUntil = staleUntil;
        }
    }
}