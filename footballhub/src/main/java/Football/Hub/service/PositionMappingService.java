package Football.Hub.service;

import Football.Hub.model.Player;
import Football.Hub.model.PlayerPosition;
import Football.Hub.repository.PlayerPositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PositionMappingService {

    private final PlayerPositionRepository playerPositionRepository;

    private static final Map<String, List<String>> POSITION_MAP = Map.of(
            "Goalkeeper",
            List.of("GK"),

            "Defender",
            List.of(
                    "LB",
                    "LCB",
                    "CB",
                    "RCB",
                    "RB",
                    "LWB",
                    "RWB"
            ),

            "Midfielder",
            List.of(
                    "LM",
                    "LDM",
                    "CDM",
                    "RDM",
                    "RM",
                    "LCM",
                    "CM",
                    "RCM",
                    "LAM",
                    "CAM",
                    "RAM"
            ),

            "Attacker",
            List.of(
                    "LW",
                    "LST",
                    "CF",
                    "RST",
                    "RW",
                    "ST"
            )
    );

    public PositionMappingService(
            PlayerPositionRepository playerPositionRepository) {

        this.playerPositionRepository =
                playerPositionRepository;
    }

    public void createPositions(
            Player player,
            String apiPosition,
            int baseScore) {

        if (apiPosition == null ||
                apiPosition.isBlank()) {

            return;
        }

        List<String> positions =
                POSITION_MAP.get(apiPosition);

        if (positions == null) {
            return;
        }

        for (String position : positions) {

            int score =
                    calculateScore(
                            apiPosition,
                            position,
                            baseScore
                    );

            List<PlayerPosition> existing =
                    playerPositionRepository
                            .findByPlayerIdAndPositionCode(
                                    player.getId(),
                                    position
                            );

            PlayerPosition playerPosition;

            if (existing.isEmpty()) {

                playerPosition =
                        new PlayerPosition(
                                player,
                                position,
                                score
                        );

            } else {

                playerPosition = existing.get(0);
                playerPosition.setSuitabilityScore(score);
            }

            playerPositionRepository.save(
                    playerPosition
            );
        }
    }

    private int calculateScore(
            String apiPosition,
            String position,
            int baseScore) {

        int score = Math.max(baseScore, 0);

        if ("Goalkeeper".equals(apiPosition)) {

            return position.equals("GK")
                    ? score
                    : 0;
        }

        if ("Defender".equals(apiPosition)) {

            if (position.equals("CB")) {
                return score;
            }

            if (position.equals("LCB") ||
                    position.equals("RCB")) {

                return Math.max(score - 2, 0);
            }

            if (position.equals("LB") ||
                    position.equals("RB")) {

                return Math.max(score - 8, 0);
            }

            return Math.max(score - 15, 0);
        }

        if ("Midfielder".equals(apiPosition)) {

            if (position.equals("CM")) {
                return score;
            }

            if (position.equals("LCM") ||
                    position.equals("RCM")) {

                return Math.max(score - 2, 0);
            }

            if (position.equals("CDM")) {
                return Math.max(score - 5, 0);
            }

            if (position.equals("CAM")) {
                return Math.max(score - 5, 0);
            }

            if (position.equals("LDM") ||
                    position.equals("RDM") ||
                    position.equals("LM") ||
                    position.equals("RM")) {

                return Math.max(score - 10, 0);
            }

            return Math.max(score - 15, 0);
        }

        if ("Attacker".equals(apiPosition)) {

            if (position.equals("ST")) {
                return score;
            }

            if (position.equals("LST") ||
                    position.equals("RST")) {

                return Math.max(score - 2, 0);
            }

            if (position.equals("CF")) {
                return Math.max(score - 4, 0);
            }

            if (position.equals("LW") ||
                    position.equals("RW")) {

                return Math.max(score - 6, 0);
            }

            return Math.max(score - 15, 0);
        }

        return 0;
    }
}
