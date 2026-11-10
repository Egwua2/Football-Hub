package Football.Hub.service;

import Football.Hub.dto.AuthResponse;
import Football.Hub.dto.UserResponse;
import Football.Hub.model.AuthSession;
import Football.Hub.model.User;
import Football.Hub.repository.AuthSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class AuthSessionService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int TOKEN_BYTES = 32;
    private static final int SESSION_DAYS = 7;

    private final AuthSessionRepository authSessionRepository;

    public AuthSessionService(AuthSessionRepository authSessionRepository) {
        this.authSessionRepository = authSessionRepository;
    }

    @Transactional
    public AuthResponse createSession(User user) {
        byte[] tokenBytes = new byte[TOKEN_BYTES];
        SECURE_RANDOM.nextBytes(tokenBytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(tokenBytes);

        LocalDateTime expiresAt = LocalDateTime.now()
                .plusDays(SESSION_DAYS);

        authSessionRepository.save(
                new AuthSession(user.getId(), hashToken(token), expiresAt)
        );

        return new AuthResponse(
                token,
                expiresAt,
                UserResponse.from(user)
        );
    }

    public Optional<Long> findUserId(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        return authSessionRepository
                .findByTokenHashAndExpiresAtAfter(
                        hashToken(token),
                        LocalDateTime.now()
                )
                .map(AuthSession::getUserId);
    }

    @Transactional
    public void revokeToken(String token) {
        if (token != null && !token.isBlank()) {
            authSessionRepository.deleteByTokenHash(hashToken(token));
        }
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available.", e);
        }
    }
}
