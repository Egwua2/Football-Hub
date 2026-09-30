package Football.Hub.repository;

import Football.Hub.model.BattleVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BattleVoteRepository
        extends JpaRepository<BattleVote, Long> {

    Optional<BattleVote> findByRoomIdAndVoterId(
            Long roomId,
            Long voterId
    );

    List<BattleVote> findByRoomId(Long roomId);

    long countByRoomId(Long roomId);

    long countByRoomIdAndVotedForId(
            Long roomId,
            Long participantId
    );
}