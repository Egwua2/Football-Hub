package Football.Hub.model;

public class BattleVotingOption {

    private Long participantId;
    private String label;
    private Squad squad;

    public BattleVotingOption() {
    }

    public BattleVotingOption(
            Long participantId,
            String label,
            Squad squad) {

        this.participantId = participantId;
        this.label = label;
        this.squad = squad;
    }

    public Long getParticipantId() {
        return participantId;
    }

    public String getLabel() {
        return label;
    }

    public Squad getSquad() {
        return squad;
    }
}