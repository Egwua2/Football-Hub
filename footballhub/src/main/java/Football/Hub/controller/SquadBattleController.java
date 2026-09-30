package Football.Hub.controller;

import Football.Hub.model.SquadBattleResult;
import Football.Hub.service.SquadBattleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/squad-battle")
@CrossOrigin(origins = "*")
public class SquadBattleController {

    private final SquadBattleService squadBattleService;

    public SquadBattleController(
            SquadBattleService squadBattleService) {

        this.squadBattleService =
                squadBattleService;
    }

    @GetMapping("/{squadId}")
    public ResponseEntity<?> calculateSquad(
            @PathVariable Long squadId) {

        try {

            SquadBattleResult result =
                    squadBattleService.calculateSquad(
                            squadId
                    );

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}