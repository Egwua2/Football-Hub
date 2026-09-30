package Football.Hub.repository;

import Football.Hub.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findByNameContainingIgnoreCase(String name);

    List<Player> findByPositionIgnoreCase(String position);

    Optional<Player> findBySportsDbId(Long sportsDbId);
}
