package Football.Hub.service;

import Football.Hub.model.PositionFitResult;
import Football.Hub.model.Squad;
import Football.Hub.model.SquadBattleResult;
import Football.Hub.model.SquadPlayer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SquadBattleService {

    private final SquadService squadService;
    private final PositionFitService positionFitService;

    public SquadBattleService(
            SquadService squadService,
            PositionFitService positionFitService) {

        this.squadService = squadService;
        this.positionFitService = positionFitService;
    }

    public SquadBattleResult calculateSquad(
            Long squadId) {

        Squad squad =
                squadService.getSquadById(squadId);

        if (squad == null) {
            throw new IllegalArgumentException(
                    "Squad not found."
            );
        }

        List<SquadPlayer> players =
                squad.getSquadPlayers();

        if (players.size() != 11) {
            throw new IllegalArgumentException(
                    "Squad Battle requires exactly 11 players."
            );
        }

        List<PositionFitResult> results =
                new ArrayList<>();

        int totalScore = 0;

        for (SquadPlayer squadPlayer : players) {

            PositionFitResult result =
                    positionFitService.calculateFit(
                            squadPlayer
                    );

            results.add(result);

            totalScore += result.getScore();
        }

        double overallScore =
                totalScore / 11.0;

        return new SquadBattleResult(
                squad.getId(),
                squad.getName(),
                Math.round(overallScore * 100.0) / 100.0,
                results
        );
    }
}