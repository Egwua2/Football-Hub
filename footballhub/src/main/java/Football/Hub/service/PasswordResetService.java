package Football.Hub.service;

import Football.Hub.model.PasswordResetCode;
import Football.Hub.model.User;
import Football.Hub.repository.AuthSessionRepository;
import Football.Hub.repository.PasswordResetCodeRepository;
import Football.Hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class PasswordResetService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int CODE_RANGE = 1_000_000;
    private static final int MAX_CODE_ATTEMPTS = 5;
    private static final int MAX_SENDS_PER_HOUR = 5;
    private static final int CODE_EXPIRY_MINUTES = 10;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final PasswordResetCodeRepository codeRepository;
    private final UserRepository userRepository;
    private final AuthSessionRepository authSessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.email.from:no-reply@footballhub.local}")
    private String fromAddress;

    public PasswordResetService(
            PasswordResetCodeRepository codeRepository,
            UserRepository userRepository,
            AuthSessionRepository authSessionRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender) {
        this.codeRepository = codeRepository;
        this.userRepository = userRepository;
        this.authSessionRepository = authSessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Transactional
    public void requestReset(String email) {
        if (!emailEnabled) {
            throw new EmailDeliveryDisabledException(
                    "Password reset email is not configured yet. Please try again later."
            );
        }

        if (email == null || email.isBlank()) {
            return;
        }

        User user = userRepository.findByEmailIgnoreCase(
                        email.trim().toLowerCase(Locale.ROOT))
                .orElse(null);

        // Always return the same API response whether the account exists or not.
        if (user == null) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        PasswordResetCode reset =
                codeRepository.findByUserIdForUpdate(user.getId())
                        .orElseGet(() -> {
                            PasswordResetCode created = new PasswordResetCode();
                            created.setUserId(user.getId());
                            created.setSendCount(0);
                            created.setFailedAttempts(0);
                            return created;
                        });

        LocalDateTime lastSentAt = reset.getLastSentAt();
        if (lastSentAt != null &&
                lastSentAt.plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(now)) {
            throw new RateLimitException(
                    "Please wait a minute before requesting another reset code."
            );
        }

        LocalDateTime windowStartedAt = reset.getWindowStartedAt();
        int sendCount = reset.getSendCount();

        if (windowStartedAt == null ||
                !windowStartedAt.plusHours(1).isAfter(now)) {
            windowStartedAt = now;
            sendCount = 0;
        }

        if (sendCount >= MAX_SENDS_PER_HOUR) {
            throw new RateLimitException(
                    "You have requested too many reset codes. Please try again in an hour."
            );
        }

        String code = String.format(
                Locale.ROOT,
                "%06d",
                RANDOM.nextInt(CODE_RANGE)
        );

        reset.setCodeHash(passwordEncoder.encode(code));
        reset.setExpiresAt(now.plusMinutes(CODE_EXPIRY_MINUTES));
        reset.setLastSentAt(now);
        reset.setWindowStartedAt(windowStartedAt);
        reset.setSendCount(sendCount + 1);
        reset.setFailedAttempts(0);

        codeRepository.save(reset);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject("Reset your Football Hub password");
        message.setText(
                "Hi " + user.getUsername() + ",\n\n" +
                "Your Football Hub password reset code is: " + code + "\n\n" +
                "This code expires in " + CODE_EXPIRY_MINUTES +
                " minutes. If you did not request a password reset, you can ignore this email.\n\n" +
                "For your security, never share this code with anyone."
        );

        try {
            mailSender.send(message);
        } catch (MailException e) {
            throw new EmailDeliveryException(
                    "We could not send the password reset email. Please try again later.",
                    e
            );
        }
    }

    @Transactional(noRollbackFor = InvalidResetCodeException.class)
    public void resetPassword(String email, String submittedCode, String newPassword) {
        if (email == null || email.isBlank() ||
                submittedCode == null ||
                !submittedCode.matches("\\d{6}")) {
            throw new InvalidResetCodeException(
                    "The reset code is invalid or has expired."
            );
        }

        validateNewPassword(newPassword);

        User user = userRepository.findByEmailIgnoreCase(
                        email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() ->
                        new InvalidResetCodeException(
                                "The reset code is invalid or has expired."
                        ));

        PasswordResetCode reset =
                codeRepository.findByUserIdForUpdate(user.getId())
                        .orElseThrow(() ->
                                new InvalidResetCodeException(
                                        "The reset code is invalid or has expired. Request a new one."
                                ));

        LocalDateTime now = LocalDateTime.now();

        if (reset.getExpiresAt() == null ||
                !reset.getExpiresAt().isAfter(now)) {
            codeRepository.delete(reset);
            throw new InvalidResetCodeException(
                    "This reset code has expired. Request a new one."
            );
        }

        if (reset.getFailedAttempts() >= MAX_CODE_ATTEMPTS) {
            throw new InvalidResetCodeException(
                    "Too many incorrect attempts. Request a new reset code."
            );
        }

        if (!passwordEncoder.matches(submittedCode, reset.getCodeHash())) {
            reset.setFailedAttempts(reset.getFailedAttempts() + 1);
            codeRepository.save(reset);

            throw new InvalidResetCodeException(
                    reset.getFailedAttempts() >= MAX_CODE_ATTEMPTS
                            ? "Too many incorrect attempts. Request a new reset code."
                            : "That reset code is incorrect. Please check it and try again."
            );
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        codeRepository.delete(reset);
        authSessionRepository.deleteByUserId(user.getId());
    }

    private void validateNewPassword(String password) {
        if (password == null || password.length() < 8 ||
                password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters and no more than 72 bytes."
            );
        }
    }

    public static class RateLimitException extends RuntimeException {
        public RateLimitException(String message) {
            super(message);
        }
    }

    public static class EmailDeliveryDisabledException extends RuntimeException {
        public EmailDeliveryDisabledException(String message) {
            super(message);
        }
    }

    public static class EmailDeliveryException extends RuntimeException {
        public EmailDeliveryException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class InvalidResetCodeException extends IllegalArgumentException {
        public InvalidResetCodeException(String message) {
            super(message);
        }
    }
}
