package Football.Hub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class BattleParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String playerName;

    private boolean host;

    private boolean submitted;

    @Enumerated(EnumType.STRING)
    private BattleParticipantStatus status;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnore
    private BattleRoom room;

    @ManyToOne
    @JoinColumn(name = "squad_id")
    private Squad squad;

    public BattleParticipant() {
    }

    public BattleParticipant(
            String playerName,
            boolean host,
            BattleRoom room) {

        this.playerName = playerName;
        this.host = host;
        this.room = room;
        this.submitted = false;
        this.status = BattleParticipantStatus.BUILDING;
    }

    public Long getId() {
        return id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public boolean isHost() {
        return host;
    }

    public void setHost(boolean host) {
        this.host = host;
    }

    public boolean isSubmitted() {
        return submitted;
    }

    public void setSubmitted(boolean submitted) {
        this.submitted = submitted;
    }

    public BattleParticipantStatus getStatus() {
        return status;
    }

    public void setStatus(
            BattleParticipantStatus status) {

        this.status = status;
    }

    public BattleRoom getRoom() {
        return room;
    }

    public void setRoom(BattleRoom room) {
        this.room = room;
    }

    public Squad getSquad() {
        return squad;
    }

    public void setSquad(Squad squad) {
        this.squad = squad;
    }
}