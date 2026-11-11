package Football.Hub.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "battle_position_votes",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"room_id", "voter_id", "position_slot"}
                )
        }
)
public class BattlePositionVote {

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
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(name = "position_slot", nullable = false)
    private String positionSlot;

    public BattlePositionVote() {
    }

    public BattlePositionVote(
            BattleRoom room,
            BattleParticipant voter,
            Player player,
            String positionSlot) {
        this.room = room;
        this.voter = voter;
        this.player = player;
        this.positionSlot = positionSlot;
    }

    public Long getId() {
        return id;
    }

    public BattleRoom getRoom() {
        return room;
    }

    public BattleParticipant getVoter() {
        return voter;
    }

    public Player getPlayer() {
        return player;
    }

    public String getPositionSlot() {
        return positionSlot;
    }
}
