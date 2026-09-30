package Football.Hub.model;

public class PositionFitResult {

    private Long playerId;
    private String playerName;

    private String assignedPosition;
    private String bestPosition;

    private String category;
    private int score;

    public PositionFitResult() {
    }

    public PositionFitResult(
            Long playerId,
            String playerName,
            String assignedPosition,
            String bestPosition,
            String category,
            int score) {

        this.playerId = playerId;
        this.playerName = playerName;
        this.assignedPosition = assignedPosition;
        this.bestPosition = bestPosition;
        this.category = category;
        this.score = score;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public String getAssignedPosition() {
        return assignedPosition;
    }

    public String getBestPosition() {
        return bestPosition;
    }

    public String getCategory() {
        return category;
    }

    public int getScore() {
        return score;
    }
}