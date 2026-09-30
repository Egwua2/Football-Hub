package Football.Hub.config;

import Football.Hub.model.BattleCategory;
import Football.Hub.repository.BattleCategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BattleDataLoader {

    @Bean
    CommandLineRunner loadBattleCategories(BattleCategoryRepository repository) {
        return args -> {
            String[] categories = {
                    "Best Premier League XI",
                    "Best Barcelona XI",
                    "Best Real Madrid XI",
                    "Best African XI",
                    "Best Under-23 XI",
                    "Best Attackers XI",
                    "Best Midfield XI",
                    "Best Defenders XI",
                    "Best National Team XI",
                    "Best All-Time XI"
            };

            for (String name : categories) {
                BattleCategory category = repository
                        .findByNameIgnoreCase(name)
                        .orElseGet(() -> new BattleCategory(name));

                category.setActive(true);
                repository.save(category);
            }
        };
    }
}
