package Football.Hub.repository;

import Football.Hub.model.BattleCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BattleCategoryRepository
        extends JpaRepository<BattleCategory, Long> {

    List<BattleCategory> findByActiveTrue();

    Optional<BattleCategory> findByNameIgnoreCase(String name);
}
