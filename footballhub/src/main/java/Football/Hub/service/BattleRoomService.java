package Football.Hub.service;

import Football.Hub.model.BattleCategory;
import Football.Hub.model.BattleParticipant;
import Football.Hub.model.BattleParticipantStatus;
import Football.Hub.model.BattleRoom;
import Football.Hub.model.BattleRoomStatus;
import Football.Hub.model.Squad;
import Football.Hub.repository.BattleCategoryRepository;
import Football.Hub.repository.BattleParticipantRepository;
import Football.Hub.repository.BattleRoomRepository;
import Football.Hub.repository.SquadRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class BattleRoomService {

    private final BattleRoomRepository battleRoomRepository;
    private final BattleParticipantRepository battleParticipantRepository;
    private final BattleCategoryRepository battleCategoryRepository;
    private final SquadRepository squadRepository;

    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "Best Premier League XI",
            "Best LaLiga XI",
            "Best Serie A XI",
            "Best Bundesliga XI",
            "Best Ligue 1 XI",
            "Best Barcelona XI",
            "Best Real Madrid XI",
            "Best Manchester United XI",
            "Best Manchester City XI",
            "Best Liverpool XI",
            "Best Arsenal XI",
            "Best Chelsea XI",
            "Best Bayern Munich XI",
            "Best AC Milan XI",
            "Best Inter Milan XI",
            "Best Juventus XI",
            "Best PSG XI",
            "Best Ajax XI",
            "Best African XI",
            "Best Nigerian XI",
            "Best Brazilian XI",
            "Best Argentine XI",
            "Best French XI",
            "Best English XI",
            "Best Spanish XI",
            "Best German XI",
            "Best Italian XI",
            "Best Portuguese XI",
            "Best Dutch XI",
            "Best South American XI",
            "Best European XI",
            "Best Under-23 XI",
            "Best Under-21 XI",
            "Best Under-20 XI",
            "Best Young Players XI",
            "Best Veterans XI",
            "Best Players Over 30 XI",
            "Best Champions League XI",
            "Best World Cup XI",
            "Best European Championship XI",
            "Best Copa America XI",
            "Best AFCON XI",
            "Best Club World Cup XI",
            "Best Europa League XI",
            "Best All-Time XI",
            "Best 21st Century XI",
            "Best 20th Century XI",
            "Best 2010s XI",
            "Best 2020s XI",
            "Best Current XI",
            "Best Legends XI",
            "Best Prime XI",
            "Best Ballon d'Or Winners XI",
            "Best Champions League Winners XI",
            "Best World Cup Winners XI",
            "Best Players Without a World Cup XI",
            "Best Players Without a Ballon d'Or XI",
            "Best One-Club XI",
            "Best Players From One Country XI",
            "Best Players From Different Countries XI",
            "Best Players From Different Leagues XI",
            "Best Academy Graduates XI",
            "Best Wonderkid XI",
            "Best Underrated XI",
            "Best Cult Heroes XI",
            "Best Rivalry XI",
            "Best XI Never to Win the Champions League",
            "Best XI Never to Win the World Cup",
            "Best XI Never to Win the Ballon d'Or",
            "Best XI With Players From One Generation",
            "Best XI With No Ballon d'Or Winners",
            "Best XI With No Champions League Winners",
            "Best XI With No World Cup Winners",
            "Best Underrated Premier League XI",
            "Best Complete Players XI",
            "Best Intelligent Players XI",
            "Best Leaders XI",
            "Best Playmakers XI",
            "Best Box-to-Box XI",
            "Best Goal-Scoring XI",
            "Best XI From 2000–2010",
            "Best XI From 2010–2020",
            "Best XI From 2015–2025",
            "Best XI From 2020–Present",
            "Best Forgotten Legends XI",
            "Best One-Season Wonders XI"
    );

    public BattleRoomService(
            BattleRoomRepository battleRoomRepository,
            BattleParticipantRepository battleParticipantRepository,
            BattleCategoryRepository battleCategoryRepository,
            SquadRepository squadRepository) {

        this.battleRoomRepository = battleRoomRepository;
        this.battleParticipantRepository = battleParticipantRepository;
        this.battleCategoryRepository = battleCategoryRepository;
        this.squadRepository = squadRepository;
    }

    public BattleRoom createRoom(String hostName) {

        if (hostName == null || hostName.isBlank()) {
            throw new IllegalArgumentException("Player name is required.");
        }

        String roomCode = generateRoomCode();

        BattleRoom room = new BattleRoom(roomCode, hostName);
        room = battleRoomRepository.save(room);

        BattleParticipant host = new BattleParticipant(
                hostName,
                true,
                room
        );

        battleParticipantRepository.save(host);

        return room;
    }

    public BattleRoom getRoom(String roomCode) {

        return battleRoomRepository.findByRoomCode(roomCode)
                .orElseThrow(() ->
                        new IllegalArgumentException("Room not found."));
    }

    public BattleParticipant joinRoom(
            String roomCode,
            String playerName) {

        BattleRoom room = getRoom(roomCode);

        if (room.getStatus() != BattleRoomStatus.WAITING) {
            throw new IllegalStateException(
                    "You cannot join a battle that has already started."
            );
        }

        if (playerName == null || playerName.isBlank()) {
            throw new IllegalArgumentException("Player name is required.");
        }

        List<BattleParticipant> participants =
                battleParticipantRepository.findByRoomId(room.getId());

        if (participants.size() >= 8) {
            throw new IllegalStateException(
                    "This room already has the maximum number of players."
            );
        }

        boolean nameTaken = participants.stream()
                .anyMatch(participant ->
                        participant.getPlayerName()
                                .equalsIgnoreCase(playerName));

        if (nameTaken) {
            throw new IllegalArgumentException(
                    "That player name is already in use."
            );
        }

        BattleParticipant participant =
                new BattleParticipant(
                        playerName,
                        false,
                        room
                );

        return battleParticipantRepository.save(participant);
    }

    public List<BattleParticipant> getParticipants(String roomCode) {

        BattleRoom room = getRoom(roomCode);

        return battleParticipantRepository
                .findByRoomId(room.getId());
    }

    public List<BattleCategory> getCategories() {

        List<BattleCategory> databaseCategories =
                battleCategoryRepository.findByActiveTrue();

        if (!databaseCategories.isEmpty()) {
            return databaseCategories;
        }

        List<BattleCategory> categories = new ArrayList<>();

        for (String name : DEFAULT_CATEGORIES) {
            categories.add(new BattleCategory(name));
        }

        return categories;
    }

    public BattleRoom setCategory(
            String roomCode,
            String category) {

        BattleRoom room = getRoom(roomCode);

        if (room.getStatus() != BattleRoomStatus.WAITING) {
            throw new IllegalStateException(
                    "Category can only be selected before the battle starts."
            );
        }

        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException(
                    "Category is required."
            );
        }

        boolean exists = getCategories()
                .stream()
                .anyMatch(item ->
                        item.getName().equalsIgnoreCase(category));

        if (!exists) {
            throw new IllegalArgumentException(
                    "Category not found."
            );
        }

        room.setCategory(category);

        return battleRoomRepository.save(room);
    }

    public BattleRoom setRandomCategory(String roomCode) {

        BattleRoom room = getRoom(roomCode);

        if (room.getStatus() != BattleRoomStatus.WAITING) {
            throw new IllegalStateException(
                    "Category can only be selected before the battle starts."
            );
        }

        List<BattleCategory> categories = getCategories();

        if (categories.isEmpty()) {
            throw new IllegalStateException(
                    "No battle categories are available."
            );
        }

        BattleCategory selected =
                categories.get(
                        new Random().nextInt(categories.size())
                );

        room.setCategory(selected.getName());

        return battleRoomRepository.save(room);
    }

    public BattleRoom startBattle(String roomCode) {

        BattleRoom room = getRoom(roomCode);

        if (room.getStatus() != BattleRoomStatus.WAITING) {
            throw new IllegalStateException(
                    "This battle has already started."
            );
        }

        if (room.getCategory() == null ||
                room.getCategory().isBlank()) {

            throw new IllegalStateException(
                    "Choose a category before starting."
            );
        }

        long playerCount =
                battleParticipantRepository.countByRoomId(room.getId());

        if (playerCount < 2) {
            throw new IllegalStateException(
                    "At least 2 players are needed to start."
            );
        }

        room.setStatus(BattleRoomStatus.BUILDING);

        List<BattleParticipant> participants =
                battleParticipantRepository.findByRoomId(room.getId());

        for (BattleParticipant participant : participants) {
            participant.setStatus(BattleParticipantStatus.BUILDING);
            participant.setSubmitted(false);
            battleParticipantRepository.save(participant);
        }

        return battleRoomRepository.save(room);
    }

    public BattleParticipant submitSquad(
            String roomCode,
            String playerName,
            Long squadId) {

        BattleRoom room = getRoom(roomCode);

        if (room.getStatus() != BattleRoomStatus.BUILDING) {
            throw new IllegalStateException(
                    "Squads can only be submitted while the battle is being built."
            );
        }

        if (playerName == null || playerName.isBlank()) {
            throw new IllegalArgumentException(
                    "Player name is required."
            );
        }

        BattleParticipant participant =
                battleParticipantRepository
                        .findByRoomIdAndPlayerName(
                                room.getId(),
                                playerName
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Player is not in this room."
                                ));

        if (participant.isSubmitted()) {
            throw new IllegalStateException(
                    "You have already submitted your squad."
            );
        }

        Squad squad = squadRepository.findById(squadId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Squad not found."
                        ));

        if (squad.getSquadPlayers().size() != 11) {
            throw new IllegalArgumentException(
                    "Your squad must contain exactly 11 players."
            );
        }

        participant.setSquad(squad);
        participant.setSubmitted(true);
        participant.setStatus(BattleParticipantStatus.SUBMITTED);

        BattleParticipant savedParticipant =
                battleParticipantRepository.save(participant);

        long totalPlayers =
                battleParticipantRepository.countByRoomId(room.getId());

        long submittedPlayers =
                battleParticipantRepository
                        .countByRoomIdAndSubmittedTrue(room.getId());

        if (submittedPlayers == totalPlayers) {

            room.setStatus(BattleRoomStatus.VOTING);
            battleRoomRepository.save(room);

            List<BattleParticipant> allParticipants =
                    battleParticipantRepository
                            .findByRoomId(room.getId());

            for (BattleParticipant item : allParticipants) {
                item.setStatus(BattleParticipantStatus.VOTING);
                battleParticipantRepository.save(item);
            }
        }

        return savedParticipant;
    }

    private String generateRoomCode() {

        String characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        Random random = new Random();

        String code;

        do {
            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < 6; i++) {
                builder.append(
                        characters.charAt(
                                random.nextInt(characters.length())
                        )
                );
            }

            code = builder.toString();

        } while (battleRoomRepository.existsByRoomCode(code));

        return code;
    }
}