package Football.Hub.service;

import Football.Hub.model.ChallengeRule;
import Football.Hub.model.SquadChallenge;
import Football.Hub.repository.SquadChallengeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChallengeService {

    private final SquadChallengeRepository challengeRepository;

    public ChallengeService(
            SquadChallengeRepository challengeRepository) {

        this.challengeRepository = challengeRepository;
    }

    public List<SquadChallenge> getChallenges() {

        return challengeRepository
                .findByActiveTrue();
    }

    public List<SquadChallenge> getChallengesByCategory(
            String category) {

        return challengeRepository
                .findByCategoryIgnoreCaseAndActiveTrue(category);
    }

    public List<SquadChallenge> getChallengesByDifficulty(
            String difficulty) {

        return challengeRepository
                .findByDifficultyIgnoreCaseAndActiveTrue(difficulty);
    }

    public SquadChallenge getChallenge(Long id) {

        return challengeRepository
                .findById(id)
                .filter(SquadChallenge::isActive)
                .orElse(null);
    }

    public SquadChallenge saveChallenge(
            SquadChallenge challenge) {

        for (ChallengeRule rule : challenge.getRules()) {
            rule.setChallenge(challenge);
        }

        return challengeRepository.save(challenge);
    }

    public void deleteChallenge(Long id) {

        if (!challengeRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Challenge not found."
            );
        }

        challengeRepository.deleteById(id);
    }
}