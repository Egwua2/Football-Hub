package Football.Hub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(
        name = "squad_players",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"squad_id", "position_slot"}
                )
        }
)
public class SquadPlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "squad_id", nullable = false)
    @JsonIgnore
    private Squad squad;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(name = "position_slot", nullable = false)
    private String positionSlot;

    public SquadPlayer() {
    }

    public SquadPlayer(
            Squad squad,
            Player player,
            String positionSlot) {

        this.squad = squad;
        this.player = player;
        this.positionSlot = positionSlot;
    }

    public Long getId() {
        return id;
    }

    public Squad getSquad() {
        return squad;
    }

    public void setSquad(Squad squad) {
        this.squad = squad;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public String getPositionSlot() {
        return positionSlot;
    }

    public void setPositionSlot(String positionSlot) {
        this.positionSlot = positionSlot;
    }
}