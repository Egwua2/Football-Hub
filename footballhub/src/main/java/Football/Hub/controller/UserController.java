package Football.Hub.controller;

import Football.Hub.dto.UserResponse;
import Football.Hub.model.User;
import Football.Hub.service.AuthSessionService;
import Football.Hub.service.EmailNotVerifiedException;
import Football.Hub.service.EmailVerificationService;
import Football.Hub.service.PasswordResetService;
import Football.Hub.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthSessionService authSessionService;
    private final PasswordResetService passwordResetService;

    public UserController(
            UserService userService,
            AuthSessionService authSessionService,
            PasswordResetService passwordResetService) {
        this.userService = userService;
        this.authSessionService = authSessionService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            User savedUser = userService.register(request.toUser());

            return ResponseEntity.accepted().body(Map.of(
                    "verificationRequired", true,
                    "email", savedUser.getEmail(),
                    "message", "A verification code has been sent to your email address."
            ));
        } catch (EmailVerificationService.RateLimitException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", e.getMessage()));
        } catch (EmailVerificationService.EmailDeliveryDisabledException |
                 EmailVerificationService.EmailDeliveryException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
            @RequestBody VerifyEmailRequest request) {
        try {
            User user = userService.verifyEmail(
                    request.email(),
                    request.code()
            );

            return ResponseEntity.ok(authSessionService.createSession(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(
            @RequestBody ResendVerificationRequest request) {
        try {
            userService.resendVerification(request.email());

            // Keep the response generic so this endpoint cannot be used
            // to discover which email addresses have accounts.
            return ResponseEntity.ok(Map.of(
                    "message",
                    "If this address needs verification, a new code will be sent."
            ));
        } catch (EmailVerificationService.RateLimitException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", e.getMessage()));
        } catch (EmailVerificationService.EmailDeliveryDisabledException |
                 EmailVerificationService.EmailDeliveryException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(
                    request.login(),
                    request.password()
            );

            return ResponseEntity.ok(
                    authSessionService.createSession(user)
            );
        } catch (EmailNotVerifiedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "code", "EMAIL_NOT_VERIFIED",
                    "message", e.getMessage(),
                    "email", e.getEmail()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.requestReset(request.email());

            return ResponseEntity.ok(Map.of(
                    "message",
                    "If an account exists for that email, a password reset code will be sent."
            ));
        } catch (EmailVerificationService.RateLimitException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", e.getMessage()));
        } catch (EmailVerificationService.EmailDeliveryDisabledException |
                 EmailVerificationService.EmailDeliveryException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(
                    request.email(),
                    request.code(),
                    request.newPassword()
            );

            return ResponseEntity.ok(Map.of(
                    "message",
                    "Your password has been reset. Please log in with your new password."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(
                    value = HttpHeaders.AUTHORIZATION,
                    required = false) String authorization) {

        if (authorization != null && authorization.startsWith("Bearer ")) {
            authSessionService.revokeToken(authorization.substring(7).trim());
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            Authentication authentication) {

        Long userId = authenticatedUserId(authentication);
        return ResponseEntity.ok(
                UserResponse.from(userService.getUser(userId))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(
            @PathVariable Long id,
            Authentication authentication) {

        if (!ownsProfile(id, authentication)) {
            return ResponseEntity.status(403)
                    .body("You cannot view another user's profile.");
        }

        try {
            return ResponseEntity.ok(
                    UserResponse.from(userService.getUser(id))
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody User updates,
            Authentication authentication) {

        if (!ownsProfile(id, authentication)) {
            return ResponseEntity.status(403)
                    .body("You cannot update another user's profile.");
        }

        try {
            User user = userService.updateProfile(id, updates);
            return ResponseEntity.ok(UserResponse.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private boolean ownsProfile(
            Long requestedUserId,
            Authentication authentication) {

        return authentication != null &&
                authentication.getName().equals(requestedUserId.toString());
    }

    private Long authenticatedUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    public record SignupRequest(
            String username,
            String email,
            String password,
            Integer age,
            String gender,
            String firstName,
            String lastName,
            String country,
            String favouriteClub,
            String favouritePlayer,
            String favouritePosition) {

        public User toUser() {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setAge(age);
            user.setGender(gender);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setCountry(country);
            user.setFavouriteClub(favouriteClub);
            user.setFavouritePlayer(favouritePlayer);
            user.setFavouritePosition(favouritePosition);
            return user;
        }
    }

    public record LoginRequest(String login, String password) {
    }

    public record VerifyEmailRequest(String email, String code) {
    }

    public record ResendVerificationRequest(String email) {
    }

    public record ForgotPasswordRequest(String email) {
    }

    public record ResetPasswordRequest(
            String email,
            String code,
            String newPassword) {
    }
}
