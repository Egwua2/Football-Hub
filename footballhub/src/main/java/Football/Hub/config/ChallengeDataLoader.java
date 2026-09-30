package Football.Hub.config;

import Football.Hub.model.ChallengeRule;
import Football.Hub.model.SquadChallenge;
import Football.Hub.repository.SquadChallengeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChallengeDataLoader {

    @Bean
    CommandLineRunner loadChallenges(
            SquadChallengeRepository repository) {

        return args -> {

            if (repository.count() > 0) {
                return;
            }


            addChallenge(
                    repository,
                    "One Club Only",
                    "Build a starting XI using players from the same club.",
                    "CLUB",
                    "EASY",
                    new String[][]{
                            {"SAME_CLUB", "true",
                                    "All 11 players must play for the same club."}
                    }
            );

            addChallenge(
                    repository,
                    "No Club Duplicates",
                    "Build an XI where every player comes from a different club.",
                    "CLUB",
                    "HARD",
                    new String[][]{
                            {"UNIQUE_CLUBS", "11",
                                    "Every player must come from a different club."}
                    }
            );

            addChallenge(
                    repository,
                    "One Nation",
                    "Build an XI using players of the same nationality.",
                    "NATIONALITY",
                    "EASY",
                    new String[][]{
                            {"SAME_NATIONALITY", "true",
                                    "All 11 players must have the same nationality."}
                    }
            );

            addChallenge(
                    repository,
                    "Around The World",
                    "Build an XI where every player has a different nationality.",
                    "NATIONALITY",
                    "HARD",
                    new String[][]{
                            {"UNIQUE_NATIONALITIES", "11",
                                    "Every player must have a different nationality."}
                    }
            );

            addChallenge(
                    repository,
                    "African XI",
                    "Build a starting XI using African players.",
                    "NATIONALITY",
                    "MEDIUM",
                    new String[][]{
                            {"CONTINENT", "AFRICA",
                                    "Every player must be from an African country."}
                    }
            );

            addChallenge(
                    repository,
                    "European XI",
                    "Build a starting XI using European players.",
                    "NATIONALITY",
                    "MEDIUM",
                    new String[][]{
                            {"CONTINENT", "EUROPE",
                                    "Every player must be from a European country."}
                    }
            );

            addChallenge(
                    repository,
                    "Maximum Two From A Club",
                    "Build an XI without having more than two players from the same club.",
                    "CLUB",
                    "MEDIUM",
                    new String[][]{
                            {"MAX_FROM_CLUB", "2",
                                    "No club can have more than two players."}
                    }
            );

            addChallenge(
                    repository,
                    "Three Nations Minimum",
                    "Build an XI using players from at least three different countries.",
                    "NATIONALITY",
                    "EASY",
                    new String[][]{
                            {"MIN_NATIONALITIES", "3",
                                    "The squad must contain at least three nationalities."}
                    }
            );

            addChallenge(
                    repository,
                    "Six Nations",
                    "Build an XI using players from at least six different countries.",
                    "NATIONALITY",
                    "MEDIUM",
                    new String[][]{
                            {"MIN_NATIONALITIES", "6",
                                    "The squad must contain at least six nationalities."}
                    }
            );

            addChallenge(
                    repository,
                    "World XI",
                    "Build an XI with 11 different nationalities.",
                    "NATIONALITY",
                    "HARD",
                    new String[][]{
                            {"UNIQUE_NATIONALITIES", "11",
                                    "All 11 players must have different nationalities."}
                    }
            );

            addChallenge(
                    repository,
                    "Club Collector",
                    "Use players from at least six different clubs.",
                    "CLUB",
                    "MEDIUM",
                    new String[][]{
                            {"MIN_CLUBS", "6",
                                    "The squad must contain players from at least six clubs."}
                    }
            );

            addChallenge(
                    repository,
                    "No Super Club",
                    "No more than one player can come from the same club.",
                    "CLUB",
                    "HARD",
                    new String[][]{
                            {"MAX_FROM_CLUB", "1",
                                    "Only one player may come from each club."}
                    }
            );

            addChallenge(
                    repository,
                    "Balanced Nations",
                    "Use at least four different nationalities in your XI.",
                    "NATIONALITY",
                    "EASY",
                    new String[][]{
                            {"MIN_NATIONALITIES", "4",
                                    "The squad must contain at least four nationalities."}
                    }
            );

            addChallenge(
                    repository,
                    "High Rated XI",
                    "Build an XI where every player meets the required rating.",
                    "RATING",
                    "HARD",
                    new String[][]{
                            {"MIN_RATING", "80",
                                    "Every player must have a rating of at least 80."}
                    }
            );

            addChallenge(
                    repository,
                    "Elite XI",
                    "Build an XI using only highly rated players.",
                    "RATING",
                    "CRAZY",
                    new String[][]{
                            {"MIN_RATING", "85",
                                    "Every player must have a rating of at least 85."}
                    }
            );

            addChallenge(
                    repository,
                    "Five Star Squad",
                    "Build an XI where every player has a rating of at least 90.",
                    "RATING",
                    "CRAZY",
                    new String[][]{
                            {"MIN_RATING", "90",
                                    "Every player must have a rating of at least 90."}
                    }
            );

            addChallenge(
                    repository,
                    "No Weak Links",
                    "Build an XI where nobody has a rating below 75.",
                    "RATING",
                    "MEDIUM",
                    new String[][]{
                            {"MIN_RATING", "75",
                                    "Every player must have a rating of at least 75."}
                    }
            );

            addChallenge(
                    repository,
                    "Mixed Clubs",
                    "Use players from at least three different clubs.",
                    "CLUB",
                    "EASY",
                    new String[][]{
                            {"MIN_CLUBS", "3",
                                    "The squad must contain players from at least three clubs."}
                    }
            );

            addChallenge(
                    repository,
                    "Four Club Challenge",
                    "Use players from at least four different clubs.",
                    "CLUB",
                    "MEDIUM",
                    new String[][]{
                            {"MIN_CLUBS", "4",
                                    "The squad must contain players from at least four clubs."}
                    }
            );

            addChallenge(
                    repository,
                    "Perfect Mix",
                    "Use at least five different nationalities and five different clubs.",
                    "MIXED",
                    "HARD",
                    new String[][]{
                            {"MIN_NATIONALITIES", "5",
                                    "The squad must contain at least five nationalities."},
                            {"MIN_CLUBS", "5",
                                    "The squad must contain at least five clubs."}
                    }
            );
        };
    }

    private void addChallenge(
            SquadChallengeRepository repository,
            String title,
            String description,
            String category,
            String difficulty,
            String[][] rules) {

        SquadChallenge challenge =
                new SquadChallenge(
                        title,
                        description,
                        category,
                        difficulty
                );

        for (String[] rule : rules) {

            ChallengeRule challengeRule =
                    new ChallengeRule(
                            challenge,
                            rule[0],
                            rule[1],
                            rule[2]
                    );

            challenge.getRules().add(
                    challengeRule
            );
        }

        repository.save(challenge);
    }
}