package Football.Hub.controller;

import Football.Hub.model.Squad;
import Football.Hub.model.SquadPlayer;
import Football.Hub.service.SquadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/squads")
@CrossOrigin(origins = "*")
public class SquadController {

    private final SquadService squadService;

    public SquadController(SquadService squadService) {
        this.squadService = squadService;
    }

    @GetMapping
    public List<Squad> getAllSquads() {
        return squadService.getAllSquads();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Squad> getSquadById(
            @PathVariable Long id) {

        Squad squad = squadService.getSquadById(id);

        if (squad == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(squad);
    }

    @PostMapping
    public ResponseEntity<?> createSquad(
            @RequestBody Map<String, String> request) {

        try {
            String name = request.get("name");
            String formation = request.get("formation");
            String managerName = request.get("managerName");

            if (name == null || name.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Squad name is required."
                        ));
            }

            if (formation == null || formation.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Formation is required."
                        ));
            }

            Squad squad =
                    squadService.createSquad(
                            name,
                            formation,
                            managerName
                    );

            return ResponseEntity.ok(squad);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @GetMapping("/{squadId}/players")
    public ResponseEntity<?> getSquadPlayers(
            @PathVariable Long squadId) {

        try {
            List<SquadPlayer> players =
                    squadService.getSquadPlayers(
                            squadId
                    );

            return ResponseEntity.ok(players);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{squadId}/players")
    public ResponseEntity<?> addPlayer(
            @PathVariable Long squadId,
            @RequestBody Map<String, Object> request) {

        try {
            Object playerIdValue =
                    request.get("playerId");

            if (playerIdValue == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Player ID is required."
                        ));
            }

            Long playerId =
                    ((Number) playerIdValue).longValue();

            String positionSlot =
                    (String) request.get("positionSlot");

            if (positionSlot == null ||
                    positionSlot.isBlank()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Position slot is required."
                        ));
            }

            Squad squad =
                    squadService.addPlayerToSquad(
                            squadId,
                            playerId,
                            positionSlot
                    );

            return ResponseEntity.ok(squad);

        } catch (IllegalArgumentException |
                 NullPointerException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage() != null
                                    ? e.getMessage()
                                    : "Invalid request."
                    ));
        }
    }

    @DeleteMapping("/{squadId}/players/{playerId}")
    public ResponseEntity<?> removePlayer(
            @PathVariable Long squadId,
            @PathVariable Long playerId) {

        try {
            squadService.removePlayerFromSquad(
                    squadId,
                    playerId
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Player removed from squad."
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @DeleteMapping("/{squadId}/positions/{positionSlot}")
    public ResponseEntity<?> removePosition(
            @PathVariable Long squadId,
            @PathVariable String positionSlot) {

        try {
            squadService.removePlayerFromPosition(
                    squadId,
                    positionSlot
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Player removed from "
                                    + positionSlot
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSquad(
            @PathVariable Long id) {

        try {
            squadService.deleteSquad(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Squad deleted successfully."
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }
}