package Football.Hub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class ChallengeRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "challenge_id", nullable = false)
    @JsonIgnore
    private SquadChallenge challenge;

    private String ruleType;

    private String ruleValue;

    @Column(length = 500)
    private String description;

    public ChallengeRule() {
    }

    public ChallengeRule(
            SquadChallenge challenge,
            String ruleType,
            String ruleValue,
            String description) {

        this.challenge = challenge;
        this.ruleType = ruleType;
        this.ruleValue = ruleValue;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public SquadChallenge getChallenge() {
        return challenge;
    }

    public void setChallenge(SquadChallenge challenge) {
        this.challenge = challenge;
    }

    public String getRuleType() {
        return ruleType;
    }

    public void setRuleType(String ruleType) {
        this.ruleType = ruleType;
    }

    public String getRuleValue() {
        return ruleValue;
    }

    public void setRuleValue(String ruleValue) {
        this.ruleValue = ruleValue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}