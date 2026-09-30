package Football.Hub.repository;

import Football.Hub.model.PlayerPosition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerPositionRepository
        extends JpaRepository<PlayerPosition, Long> {

    List<PlayerPosition> findByPlayerId(Long playerId);

    List<PlayerPosition> findByPlayerIdAndPositionCode(
            Long playerId,
            String positionCode
    );
}