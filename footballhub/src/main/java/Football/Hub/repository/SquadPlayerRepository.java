package Football.Hub.repository;

import Football.Hub.model.SquadPlayer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SquadPlayerRepository extends JpaRepository<SquadPlayer, Long> {

    Optional<SquadPlayer> findBySquadIdAndPositionSlot(
            Long squadId,
            String positionSlot
    );

    boolean existsBySquadIdAndPlayerId(
            Long squadId,
            Long playerId
    );

    Optional<SquadPlayer> findBySquadIdAndPlayerId(
            Long squadId,
            Long playerId
    );

    List<SquadPlayer> findBySquadId(Long squadId);
}