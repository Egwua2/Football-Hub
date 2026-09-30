package Football.Hub.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "battle_votes",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"room_id", "voter_id"}
                )
        }
)
public class BattleVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private BattleRoom room;

    @ManyToOne
    @JoinColumn(name = "voter_id", nullable = false)
    private BattleParticipant voter;

    @ManyToOne
    @JoinColumn(name = "voted_for_id", nullable = false)
    private BattleParticipant votedFor;

    public BattleVote() {
    }

    public BattleVote(
            BattleRoom room,
            BattleParticipant voter,
            BattleParticipant votedFor) {

        this.room = room;
        this.voter = voter;
        this.votedFor = votedFor;
    }

    public Long getId() {
        return id;
    }

    public BattleRoom getRoom() {
        return room;
    }

    public void setRoom(BattleRoom room) {
        this.room = room;
    }

    public BattleParticipant getVoter() {
        return voter;
    }

    public void setVoter(BattleParticipant voter) {
        this.voter = voter;
    }

    public BattleParticipant getVotedFor() {
        return votedFor;
    }

    public void setVotedFor(BattleParticipant votedFor) {
        this.votedFor = votedFor;
    }
}