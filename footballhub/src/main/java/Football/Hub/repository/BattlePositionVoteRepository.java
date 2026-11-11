package Football.Hub.repository;

import Football.Hub.model.BattlePositionVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BattlePositionVoteRepository
        extends JpaRepository<BattlePositionVote, Long> {

    List<BattlePositionVote> findByRoomId(Long roomId);

    List<BattlePositionVote> findByRoomIdAndVoterId(
            Long roomId,
            Long voterId
    );

    Optional<BattlePositionVote> findByRoomIdAndVoterIdAndPositionSlot(
            Long roomId,
            Long voterId,
            String positionSlot
    );

    long countByRoomId(Long roomId);

    void deleteByRoomId(Long roomId);

    void deleteByRoomIdAndVoterId(Long roomId, Long voterId);
}
