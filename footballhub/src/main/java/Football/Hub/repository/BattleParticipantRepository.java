package Football.Hub.repository;

import Football.Hub.model.BattleParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BattleParticipantRepository
        extends JpaRepository<BattleParticipant, Long> {

    List<BattleParticipant> findByRoomId(
            Long roomId
    );

    Optional<BattleParticipant>
    findByRoomIdAndPlayerName(
            Long roomId,
            String playerName
    );

    long countByRoomId(Long roomId);

    long countByRoomIdAndSubmittedTrue(
            Long roomId
    );
}