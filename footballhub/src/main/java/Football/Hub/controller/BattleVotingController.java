package Football.Hub.controller;

import Football.Hub.model.BattleRankingResult;
import Football.Hub.model.BattleVote;
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
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @PostMapping("/{roomCode}/vote")
    public ResponseEntity<?> vote(
            @PathVariable String roomCode,
            @RequestBody Map<String, Object> request) {

        try {

            String voterName =
                    (String) request.get("voterName");

            Number votedForIdNumber =
                    (Number) request.get("votedForId");

            if (votedForIdNumber == null) {
                throw new IllegalArgumentException(
                        "Player to vote for is required."
                );
            }

            Long votedForId =
                    votedForIdNumber.longValue();

            BattleVote vote =
                    battleVotingService.castVote(
                            roomCode,
                            voterName,
                            votedForId
                    );

            return ResponseEntity.ok(vote);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @GetMapping("/{roomCode}/results")
    public ResponseEntity<?> getResults(
            @PathVariable String roomCode) {

        try {

            List<BattleRankingResult> results =
                    battleVotingService.getRanking(roomCode);

            return ResponseEntity.ok(results);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }
}