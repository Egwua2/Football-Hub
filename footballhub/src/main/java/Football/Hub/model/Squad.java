package Football.Hub.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Squad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String formation;

    private String managerName;

    @ManyToOne
    @JoinColumn(name = "challenge_id")
    private SquadChallenge challenge;

    @OneToMany(
            mappedBy = "squad",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<SquadPlayer> squadPlayers = new ArrayList<>();

    public Squad() {
    }

    public Squad(
            String name,
            String formation) {

        this.name = name;
        this.formation = formation;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getFormation() {
        return formation;
    }

    public void setFormation(String formation) {
        this.formation = formation;
    }

    public SquadChallenge getChallenge() {
        return challenge;
    }

    public void setChallenge(SquadChallenge challenge) {
        this.challenge = challenge;
    }

    public List<SquadPlayer> getSquadPlayers() {
        return squadPlayers;
    }

    public void setSquadPlayers(
            List<SquadPlayer> squadPlayers) {

        this.squadPlayers = squadPlayers;
    }
}