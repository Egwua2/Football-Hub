package Football.Hub.controller;

import Football.Hub.model.ChallengeValidationResult;
import Football.Hub.model.Squad;
import Football.Hub.model.SquadChallenge;
import Football.Hub.service.ChallengeService;
import Football.Hub.service.ChallengeValidationService;
import Football.Hub.service.SquadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    private final ChallengeService challengeService;
    private final ChallengeValidationService validationService;
    private final SquadService squadService;

    public ChallengeController(
            ChallengeService challengeService,
            ChallengeValidationService validationService,
            SquadService squadService) {

        this.challengeService = challengeService;
        this.validationService = validationService;
        this.squadService = squadService;
    }

    @GetMapping
    public List<SquadChallenge> getChallenges() {
        return challengeService.getChallenges();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SquadChallenge> getChallenge(
            @PathVariable Long id) {

        SquadChallenge challenge =
                challengeService.getChallenge(id);

        if (challenge == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(challenge);
    }

    @GetMapping("/category/{category}")
    public List<SquadChallenge> getByCategory(
            @PathVariable String category) {

        return challengeService
                .getChallengesByCategory(category);
    }

    @GetMapping("/difficulty/{difficulty}")
    public List<SquadChallenge> getByDifficulty(
            @PathVariable String difficulty) {

        return challengeService
                .getChallengesByDifficulty(difficulty);
    }

    @PostMapping
    public ResponseEntity<SquadChallenge> createChallenge(
            @RequestBody SquadChallenge challenge) {

        return ResponseEntity.ok(
                challengeService.saveChallenge(challenge)
        );
    }

    @PostMapping("/{challengeId}/validate/{squadId}")
    public ResponseEntity<ChallengeValidationResult> validateSquad(
            @PathVariable Long challengeId,
            @PathVariable Long squadId) {

        SquadChallenge challenge =
                challengeService.getChallenge(challengeId);

        Squad squad =
                squadService.getSquadById(squadId);

        ChallengeValidationResult result =
                validationService.validate(
                        squad,
                        challenge
                );

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallenge(
            @PathVariable Long id) {

        try {
            challengeService.deleteChallenge(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Challenge deleted successfully."
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }
}