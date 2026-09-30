package Football.Hub.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "player_positions",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"player_id", "position_code"}
                )
        }
)
public class PlayerPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(name = "position_code", nullable = false)
    private String positionCode;

    /*
     * How naturally the player can play this position.
     *
     * 100 = Natural
     * 85  = Close
     * 65  = Acceptable
     * 25  = Poor / emergency
     */
    @Column(nullable = false)
    private Integer suitabilityScore;

    public PlayerPosition() {
    }

    public PlayerPosition(
            Player player,
            String positionCode,
            Integer suitabilityScore) {

        this.player = player;
        this.positionCode = positionCode;
        this.suitabilityScore = suitabilityScore;
    }

    public Long getId() {
        return id;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public String getPositionCode() {
        return positionCode;
    }

    public void setPositionCode(String positionCode) {
        this.positionCode = positionCode;
    }

    public Integer getSuitabilityScore() {
        return suitabilityScore;
    }

    public void setSuitabilityScore(Integer suitabilityScore) {
        this.suitabilityScore = suitabilityScore;
    }
}