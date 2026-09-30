package Football.Hub.controller;

import Football.Hub.model.Player;
import Football.Hub.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "*")
public class PlayerController {

private final PlayerService playerService;

public PlayerController(
        PlayerService playerService) {

    this.playerService = playerService;
}

@GetMapping
public List<Player> getAllPlayers() {
    return playerService.getAllPlayers();
}

@GetMapping("/search")
public List<Player> searchPlayers(
        @RequestParam String name) {

    return playerService.searchPlayers(name);
}

@GetMapping("/position")
public List<Player> searchPlayersByPosition(
        @RequestParam String position) {

    return playerService
            .searchPlayersByPosition(position);
}

@GetMapping("/api-search")
public ResponseEntity<?> searchPlayersFromApi(
        @RequestParam String name) {

    try {

        List<Player> players =
                playerService.searchPlayersFromApi(name);

        return ResponseEntity.ok(players);

    } catch (IllegalStateException e) {

        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(Map.of(
                        "error",
                        e.getMessage()
                ));

    } catch (Exception e) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error",
                        "Unable to retrieve players from API."
                ));
    }
}

@GetMapping("/{id}")
public ResponseEntity<Player> getPlayerById(
        @PathVariable Long id) {

    Player player =
            playerService.getPlayerById(id);

    if (player == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(player);
}

@PostMapping
public ResponseEntity<Player> createPlayer(
        @RequestBody Player player) {

    return ResponseEntity.ok(
            playerService.savePlayer(player)
    );
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deletePlayer(
        @PathVariable Long id) {

    try {

        playerService.deletePlayer(id);

        return ResponseEntity.noContent().build();

    } catch (IllegalArgumentException e) {

        return ResponseEntity.notFound().build();
    }
}

}
