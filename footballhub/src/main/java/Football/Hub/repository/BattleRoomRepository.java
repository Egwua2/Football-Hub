package Football.Hub.repository;

import Football.Hub.model.BattleRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BattleRoomRepository
        extends JpaRepository<BattleRoom, Long> {

    Optional<BattleRoom> findByRoomCode(String roomCode);

    boolean existsByRoomCode(String roomCode);
}