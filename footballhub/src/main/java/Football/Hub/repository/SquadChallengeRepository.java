package Football.Hub.repository;

import Football.Hub.model.SquadChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SquadChallengeRepository
        extends JpaRepository<SquadChallenge, Long> {

    List<SquadChallenge> findByActiveTrue();

    List<SquadChallenge> findByCategoryIgnoreCaseAndActiveTrue(
            String category
    );

    List<SquadChallenge> findByDifficultyIgnoreCaseAndActiveTrue(
            String difficulty
    );
}