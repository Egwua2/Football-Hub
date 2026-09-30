package Football.Hub.controller;

import Football.Hub.model.BattleCategory;
import Football.Hub.model.BattleParticipant;
import Football.Hub.model.BattleRoom;
import Football.Hub.service.BattleRoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/battle/rooms")
@CrossOrigin(origins = "*")
public class BattleRoomController {

    private final BattleRoomService battleRoomService;

    public BattleRoomController(BattleRoomService battleRoomService) {
        this.battleRoomService = battleRoomService;
    }

    @PostMapping
    public ResponseEntity<?> createRoom(
            @RequestBody Map<String, String> request) {

        try {
            String playerName = request.get("playerName");

            BattleRoom room =
                    battleRoomService.createRoom(playerName);

            return ResponseEntity.ok(room);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {

        try {
            List<BattleCategory> categories =
                    battleRoomService.getCategories();

            return ResponseEntity.ok(categories);

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<?> getRoom(
            @PathVariable String roomCode) {

        try {
            return ResponseEntity.ok(
                    battleRoomService.getRoom(roomCode)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<?> joinRoom(
            @PathVariable String roomCode,
            @RequestBody Map<String, String> request) {

        try {
            String playerName = request.get("playerName");

            BattleParticipant participant =
                    battleRoomService.joinRoom(
                            roomCode,
                            playerName
                    );

            return ResponseEntity.ok(participant);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{roomCode}/players")
    public ResponseEntity<?> getPlayers(
            @PathVariable String roomCode) {

        try {
            return ResponseEntity.ok(
                    battleRoomService.getParticipants(roomCode)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{roomCode}/category")
    public ResponseEntity<?> setCategory(
            @PathVariable String roomCode,
            @RequestBody Map<String, String> request) {

        try {
            String category = request.get("category");

            BattleRoom room =
                    battleRoomService.setCategory(
                            roomCode,
                            category
                    );

            return ResponseEntity.ok(room);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{roomCode}/random-category")
    public ResponseEntity<?> setRandomCategory(
            @PathVariable String roomCode) {

        try {
            BattleRoom room =
                    battleRoomService.setRandomCategory(roomCode);

            return ResponseEntity.ok(room);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{roomCode}/start")
    public ResponseEntity<?> startBattle(
            @PathVariable String roomCode) {

        try {
            BattleRoom room =
                    battleRoomService.startBattle(roomCode);

            return ResponseEntity.ok(room);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{roomCode}/submit")
    public ResponseEntity<?> submitSquad(
            @PathVariable String roomCode,
            @RequestBody Map<String, Object> request) {

        try {
            String playerName =
                    (String) request.get("playerName");

            Number squadIdNumber =
                    (Number) request.get("squadId");

            if (squadIdNumber == null) {
                throw new IllegalArgumentException(
                        "Squad ID is required."
                );
            }

            Long squadId = squadIdNumber.longValue();

            BattleParticipant participant =
                    battleRoomService.submitSquad(
                            roomCode,
                            playerName,
                            squadId
                    );

            return ResponseEntity.ok(participant);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}