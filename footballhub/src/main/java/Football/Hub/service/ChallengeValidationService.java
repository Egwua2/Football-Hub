package Football.Hub.service;

import Football.Hub.model.ChallengeRule;
import Football.Hub.model.ChallengeValidationResult;
import Football.Hub.model.Player;
import Football.Hub.model.Squad;
import Football.Hub.model.SquadChallenge;
import Football.Hub.model.SquadPlayer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChallengeValidationService {

    public ChallengeValidationResult validate(
            Squad squad,
            SquadChallenge challenge) {

        if (squad == null) {
            return new ChallengeValidationResult(
                    false,
                    "Squad not found."
            );
        }

        if (challenge == null) {
            return new ChallengeValidationResult(
                    false,
                    "No challenge was selected."
            );
        }

        List<SquadPlayer> squadPlayers =
                squad.getSquadPlayers();

        if (squadPlayers.size() != 11) {
            return new ChallengeValidationResult(
                    false,
                    "The squad must contain exactly 11 players."
            );
        }

        for (ChallengeRule rule : challenge.getRules()) {

            if (!checkRule(squadPlayers, rule)) {
                return new ChallengeValidationResult(
                        false,
                        rule.getDescription()
                );
            }
        }

        return new ChallengeValidationResult(
                true,
                "Challenge completed successfully."
        );
    }

    private boolean checkRule(
            List<SquadPlayer> squadPlayers,
            ChallengeRule rule) {

        String type = rule.getRuleType();
        String value = rule.getRuleValue();

        List<Player> players =
                squadPlayers.stream()
                        .map(SquadPlayer::getPlayer)
                        .toList();

        switch (type) {

            case "SAME_CLUB":
                return sameClub(players);

            case "UNIQUE_CLUBS":
                return uniqueCount(
                        players.stream()
                                .map(Player::getClub)
                                .collect(Collectors.toSet()),
                        Integer.parseInt(value)
                );

            case "MAX_FROM_CLUB":
                return maxPlayersFromClub(
                        players,
                        Integer.parseInt(value)
                );

            case "SAME_NATIONALITY":
                return sameNationality(players);

            case "UNIQUE_NATIONALITIES":
                return uniqueCount(
                        players.stream()
                                .map(Player::getNationality)
                                .collect(Collectors.toSet()),
                        Integer.parseInt(value)
                );

            case "MIN_NATIONALITIES":
                return minimumUniqueCount(
                        players.stream()
                                .map(Player::getNationality)
                                .collect(Collectors.toSet()),
                        Integer.parseInt(value)
                );

            case "MIN_CLUBS":
                return minimumUniqueCount(
                        players.stream()
                                .map(Player::getClub)
                                .collect(Collectors.toSet()),
                        Integer.parseInt(value)
                );

            case "MIN_RATING":
                return minimumRating(
                        players,
                        Integer.parseInt(value)
                );

            case "CONTINENT":
                return playersFromContinent(
                        players,
                        value
                );

            default:
                return false;
        }
    }

    private boolean sameClub(List<Player> players) {

        if (players.isEmpty()) {
            return false;
        }

        String club = players.get(0).getClub();

        if (club == null) {
            return false;
        }

        return players.stream()
                .allMatch(player ->
                        club.equalsIgnoreCase(
                                player.getClub()
                        ));
    }

    private boolean sameNationality(List<Player> players) {

        if (players.isEmpty()) {
            return false;
        }

        String nationality =
                players.get(0).getNationality();

        if (nationality == null) {
            return false;
        }

        return players.stream()
                .allMatch(player ->
                        nationality.equalsIgnoreCase(
                                player.getNationality()
                        ));
    }

    private boolean uniqueCount(
            Set<String> values,
            int required) {

        return values.size() == required;
    }

    private boolean minimumUniqueCount(
            Set<String> values,
            int required) {

        return values.size() >= required;
    }

    private boolean maxPlayersFromClub(
            List<Player> players,
            int maximum) {

        Map<String, Long> clubCounts =
                players.stream()
                        .collect(Collectors.groupingBy(
                                Player::getClub,
                                Collectors.counting()
                        ));

        return clubCounts.values()
                .stream()
                .allMatch(count ->
                        count <= maximum
                );
    }

    private boolean minimumRating(
            List<Player> players,
            int minimum) {

        return players.stream()
                .allMatch(player ->
                        player.getRating() != null &&
                        player.getRating() >= minimum
                );
    }

    private boolean playersFromContinent(
            List<Player> players,
            String continent) {

        Set<String> africanCountries = Set.of(
                "Nigeria",
                "Ghana",
                "Senegal",
                "Cameroon",
                "Ivory Coast",
                "Côte d'Ivoire",
                "Egypt",
                "Morocco",
                "Algeria",
                "Tunisia",
                "South Africa",
                "Mali",
                "Guinea",
                "DR Congo",
                "Democratic Republic of the Congo"
        );

        Set<String> europeanCountries = Set.of(
                "England",
                "Spain",
                "France",
                "Germany",
                "Italy",
                "Portugal",
                "Netherlands",
                "Belgium",
                "Croatia",
                "Serbia",
                "Scotland",
                "Wales",
                "Ukraine",
                "Poland",
                "Denmark",
                "Sweden",
                "Norway",
                "Switzerland",
                "Austria",
                "Turkey"
        );

        Set<String> countries;

        if (continent.equalsIgnoreCase("AFRICA")) {
            countries = africanCountries;
        } else if (continent.equalsIgnoreCase("EUROPE")) {
            countries = europeanCountries;
        } else {
            return false;
        }

        return players.stream()
                .allMatch(player ->
                        player.getNationality() != null &&
                        countries.contains(
                                player.getNationality()
                        ));
    }
}