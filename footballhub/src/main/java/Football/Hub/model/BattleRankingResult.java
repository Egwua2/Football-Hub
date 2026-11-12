package Football.Hub.model;

public class BattleRankingResult {

    private int rank;
    private Long participantId;
    private String playerName;
    private int points;

    public BattleRankingResult() {
    }

    public BattleRankingResult(
            int rank,
            Long participantId,
            String playerName,
            int points) {

        this.rank = rank;
        this.participantId = participantId;
        this.playerName = playerName;
        this.points = points;
    }

    public int getRank() {
        return rank;
    }

    public Long getParticipantId() {
        return participantId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public int getPoints() {
        return points;
    }
}
