package Football.Hub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class SportsDbService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public SportsDbService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://www.thesportsdb.com/api/v1/json/3")
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
