package Football.Hub.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class BattleRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomCode;

    private String hostName;

    private String category;

    @Enumerated(EnumType.STRING)
    private BattleRoomStatus status;

    @OneToMany(
            mappedBy = "room",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<BattleParticipant> participants =
            new ArrayList<>();

    public BattleRoom() {
    }

    public BattleRoom(
            String roomCode,
            String hostName) {

        this.roomCode = roomCode;
        this.hostName = hostName;
        this.status = BattleRoomStatus.WAITING;
    }

    public Long getId() {
        return id;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BattleRoomStatus getStatus() {
        return status;
    }

    public void setStatus(
            BattleRoomStatus status) {

        this.status = status;
    }

    public List<BattleParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(
            List<BattleParticipant> participants) {

        this.participants = participants;
    }
}