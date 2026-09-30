package Football.Hub.model;

import java.util.List;

public class SquadBattleResult {

    private Long squadId;
    private String squadName;
    private double overallScore;
    private List<PositionFitResult> playerResults;

    public SquadBattleResult() {
    }

    public SquadBattleResult(
            Long squadId,
            String squadName,
            double overallScore,
            List<PositionFitResult> playerResults) {

        this.squadId = squadId;
        this.squadName = squadName;
        this.overallScore = overallScore;
        this.playerResults = playerResults;
    }

    public Long getSquadId() {
        return squadId;
    }

    public String getSquadName() {
        return squadName;
    }

    public double getOverallScore() {
        return overallScore;
    }

    public List<PositionFitResult> getPlayerResults() {
        return playerResults;
    }
}