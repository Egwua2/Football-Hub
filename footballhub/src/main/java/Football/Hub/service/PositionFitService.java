package Football.Hub.service;

import Football.Hub.model.Player;
import Football.Hub.model.PlayerPosition;
import Football.Hub.model.PositionFitResult;
import Football.Hub.model.SquadPlayer;
import Football.Hub.repository.PlayerPositionRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class PositionFitService {

    private final PlayerPositionRepository playerPositionRepository;

    public PositionFitService(
            PlayerPositionRepository playerPositionRepository) {

        this.playerPositionRepository =
                playerPositionRepository;
    }

    public PositionFitResult calculateFit(
            SquadPlayer squadPlayer) {

        Player player = squadPlayer.getPlayer();

        String assignedPosition =
                squadPlayer.getPositionSlot();

        List<PlayerPosition> positions =
                playerPositionRepository
                        .findByPlayerId(player.getId());

        PlayerPosition assigned =
                positions.stream()
                        .filter(position ->
                                position.getPositionCode()
                                        .equalsIgnoreCase(
                                                assignedPosition
                                        ))
                        .findFirst()
                        .orElse(null);

        PlayerPosition best =
                positions.stream()
                        .max(Comparator.comparing(
                                PlayerPosition::getSuitabilityScore
                        ))
                        .orElse(null);

        int score = 0;
        String category = "UNKNOWN";

        if (assigned != null) {
            score = assigned.getSuitabilityScore();

            if (score >= 90) {
                category = "PERFECT";
            } else if (score >= 80) {
                category = "EXCELLENT";
            } else if (score >= 70) {
                category = "GOOD";
            } else if (score >= 50) {
                category = "AVERAGE";
            } else {
                category = "POOR";
            }
        }

        String bestPosition =
                best != null
                        ? best.getPositionCode()
                        : null;

        return new PositionFitResult(
                player.getId(),
                player.getName(),
                assignedPosition,
                bestPosition,
                category,
                score
        );
    }
}