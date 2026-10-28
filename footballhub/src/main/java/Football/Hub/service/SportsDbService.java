package Football.Hub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class SportsDbService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    // The old "3" key was permanently disabled by TheSportsDB. "123" is their
    // current free test key. To use a premium key later, set the
    // SPORTSDB_API_KEY environment variable (e.g. on Railway) - no code change.
    public SportsDbService(
            @Value("${SPORTSDB_API_KEY:123}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl("https://www.thesportsdb.com/api/v1/json/" + apiKey)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode searchPlayers(String name) {
        try {
            String response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/searchplayers.php")
                            .queryParam("p", name)
                            .build())
                    .retrieve()
                    .body(String.class);

            return objectMapper.readTree(response);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Unable to reach TheSportsDB: " + e.getMessage(), e);
        }
    }
}