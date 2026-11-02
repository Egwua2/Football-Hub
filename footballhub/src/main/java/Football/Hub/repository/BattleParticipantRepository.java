package Football.Hub.repository;

import Football.Hub.model.BattleParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BattleParticipantRepository
        extends JpaRepository<BattleParticipant, Long> {

    @Query("""
            select participant
            from BattleParticipant participant
            where participant.room.id = :roomId
            order by participant.id
            """)
    List<BattleParticipant> findByRoomId(
            @Param("roomId") Long roomId
    );

    Optional<BattleParticipant>
    findByRoomIdAndPlayerName(
            Long roomId,
            String playerName
    );

    @Query("""
            select count(participant)
            from BattleParticipant participant
            where participant.room.id = :roomId
            """)
    long countByRoomId(
            @Param("roomId") Long roomId
    );

    long countByRoomIdAndSubmittedTrue(
            Long roomId
    );
}