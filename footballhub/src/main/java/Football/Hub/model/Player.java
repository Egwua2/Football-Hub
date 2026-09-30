package Football.Hub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sportsDbId;

    private String name;
    private String position;
    private String club;
    private String nationality;
    private String photo;
    private Integer rating;

    @OneToMany(
            mappedBy = "player",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<PlayerPosition> positions = new ArrayList<>();

    public Player() {
    }

    public Player(
            String name,
            String position,
            String club,
            String nationality,
            String photo,
            Integer rating) {

        this.name = name;
        this.position = position;
        this.club = club;
        this.nationality = nationality;
        this.photo = photo;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public Long getSportsDbId() {
        return sportsDbId;
    }

    public void setSportsDbId(Long sportsDbId) {
        this.sportsDbId = sportsDbId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getClub() {
        return club;
    }

    public void setClub(String club) {
        this.club = club;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public List<PlayerPosition> getPositions() {
        return positions;
    }

    public void setPositions(List<PlayerPosition> positions) {
        this.positions = positions;
    }
}