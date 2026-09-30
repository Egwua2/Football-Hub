package Football.Hub.model;

public class BattleRankingResult {

    private int rank;
    private Long participantId;
    private String playerName;
    private int votes;
    private double squadScore;

    public BattleRankingResult() {
    }

    public BattleRankingResult(
            int rank,
            Long participantId,
            String playerName,
            int votes,
            double squadScore) {

        this.rank = rank;
        this.participantId = participantId;
        this.playerName = playerName;
        this.votes = votes;
        this.squadScore = squadScore;
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

    public int getVotes() {
        return votes;
    }

    public double getSquadScore() {
        return squadScore;
    }
}