package Football.Hub.controller;

import Football.Hub.model.BattleResultsResponse;
import Football.Hub.model.BattleVotingOption;
import Football.Hub.service.BattleVotingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/battle/voting")
@CrossOrigin(origins = "*")
public class BattleVotingController {

    private final BattleVotingService battleVotingService;

    public BattleVotingController(
            BattleVotingService battleVotingService) {
        this.battleVotingService = battleVotingService;
    }

    @GetMapping("/{roomCode}/options")
    public ResponseEntity<?> getVotingOptions(
            @PathVariable String roomCode,
            @RequestParam String voterName) {

        try {
            List<BattleVotingOption> options =
                    battleVotingService.getVotingOptions(
                            roomCode,
                            voterName
                    );

            return ResponseEntity.ok(options);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{roomCode}/vote")
    public ResponseEntity<?> vote(
            @PathVariable String roomCode,
            @RequestBody Map<String, Object> request) {

        try {
            String voterName =
                    (String) request.get("voterName");
            String positionSlot =
                    (String) request.get("positionSlot");
            Number playerIdNumber =
                    (Number) request.get("playerId");

            if (playerIdNumber == null) {
                throw new IllegalArgumentException(
                        "Choose a player for this position."
                );
            }

            battleVotingService.castVote(
                    roomCode,
                    voterName,
                    positionSlot,
                    playerIdNumber.longValue()
            );

            return ResponseEntity.ok(
                    Map.of("success", true)
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{roomCode}/results")
    public ResponseEntity<?> getResults(
            @PathVariable String roomCode) {

        try {
            BattleResultsResponse results =
                    battleVotingService.getResults(roomCode);

            return ResponseEntity.ok(results);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
