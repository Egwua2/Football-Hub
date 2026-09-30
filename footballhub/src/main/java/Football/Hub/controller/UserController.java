package Football.Hub.controller;

import Football.Hub.model.User;
import Football.Hub.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request) {

        try {
            User user = userService.register(
                    request.get("username"),
                    request.get("email"),
                    request.get("password")
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Account created successfully.",
                            "user", user
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        try {
            User user = userService.login(
                    request.get("usernameOrEmail"),
                    request.get("password")
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Login successful.",
                            "user", user
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}