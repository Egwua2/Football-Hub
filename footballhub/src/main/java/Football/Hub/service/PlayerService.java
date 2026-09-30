package Football.Hub.service;

import Football.Hub.model.Player;
import Football.Hub.repository.PlayerRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final SportsDbService sportsDbService;
    private final PositionMappingService positionMappingService;

    public PlayerService(
            PlayerRepository playerRepository,
            SportsDbService sportsDbService,
            PositionMappingService positionMappingService) {

        this.playerRepository = playerRepository;
        this.sportsDbService = sportsDbService;
        this.positionMappingService = positionMappingService;
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public List<Player> searchPlayers(String name) {
        return playerRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Player> searchPlayersByPosition(String position) {
        return playerRepository.findByPositionIgnoreCase(position);
    }

    public Player getPlayerById(Long id) {
        return playerRepository.findById(id).orElse(null);
    }

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new IllegalArgumentException("Player not found.");
        }
        playerRepository.deleteById(id);
    }

    public List<Player> searchPlayersFromApi(String name) {
        JsonNode root = sportsDbService.searchPlayers(name);
        JsonNode data = root.get("player");
        List<Player> players = new ArrayList<>();

        if (data == null || !data.isArray()) {
            return players;
        }

        for (JsonNode item : data) {
            long sportsDbId = item.path("idPlayer").asLong(0);
            if (sportsDbId == 0) {
                continue;
            }

            Player player = playerRepository
                    .findBySportsDbId(sportsDbId)
                    .orElseGet(Player::new);

            String nameValue = text(item, "strPlayer");
            String position = normalizePosition(text(item, "strPosition"));
            String club = text(item, "strTeam");
            String nationality = text(item, "strNationality");
            String photo = firstText(item, "strThumb", "strRender", "strCutout");

            player.setSportsDbId(sportsDbId);
            player.setName(nameValue);
            player.setPosition(position);
            player.setClub(club);
            player.setNationality(nationality);
            player.setPhoto(photo);

            // TheSportsDB does not provide the same numeric player rating
            // field as the previous API, so keep the rating neutral.
            if (player.getRating() == null) {
                player.setRating(0);
            }

            Player savedPlayer = playerRepository.save(player);
            positionMappingService.createPositions(
                    savedPlayer,
                    position,
                    savedPlayer.getRating()
            );

            players.add(savedPlayer);
        }

        return players;
    }

    private String normalizePosition(String position) {
        if (position == null || position.isBlank()) {
            return null;
        }

        String value = position.trim();

        if (value.equalsIgnoreCase("Forward") ||
                value.equalsIgnoreCase("Striker") ||
                value.equalsIgnoreCase("Attacking Midfielder")) {
            return "Attacker";
        }

        if (value.equalsIgnoreCase("Midfielder")) {
            return "Midfielder";
        }

        if (value.equalsIgnoreCase("Defender")) {
            return "Defender";
        }

        if (value.equalsIgnoreCase("Goalkeeper")) {
            return "Goalkeeper";
        }

        return value;
    }

    private String text(JsonNode node, String field) {
        String value = node.path(field).asText("");
        return value.isBlank() ? null : value;
    }

    private String firstText(JsonNode node, String... fields) {
        for (String field : fields) {
            String value = text(node, field);
            if (value != null) {
                return value;
            }
        }
        return null;
    }
}
