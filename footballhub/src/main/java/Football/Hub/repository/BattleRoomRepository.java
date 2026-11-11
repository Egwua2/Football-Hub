package Football.Hub.repository;

import Football.Hub.model.BattleRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.Optional;

public interface BattleRoomRepository
        extends JpaRepository<BattleRoom, Long> {

    Optional<BattleRoom> findByRoomCode(String roomCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select room from BattleRoom room where room.roomCode = :roomCode")
    Optional<BattleRoom> findByRoomCodeForUpdate(
            @Param("roomCode") String roomCode
    );

    boolean existsByRoomCode(String roomCode);
}