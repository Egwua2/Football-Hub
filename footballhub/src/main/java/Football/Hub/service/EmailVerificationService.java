package Football.Hub.service;

import Football.Hub.model.EmailVerificationCode;
import Football.Hub.model.User;
import Football.Hub.repository.EmailVerificationCodeRepository;
import Football.Hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class EmailVerificationService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int CODE_RANGE = 1_000_000;
    private static final int MAX_CODE_ATTEMPTS = 5;
    private static final int MAX_SENDS_PER_HOUR = 5;
    private static final int CODE_EXPIRY_MINUTES = 10;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final EmailVerificationCodeRepository codeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.email.from:no-reply@footballhub.local}")
    private String fromAddress;

    public EmailVerificationService(
            EmailVerificationCodeRepository codeRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender) {
        this.codeRepository = codeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Transactional
    public void sendCode(User user) {
        if (!emailEnabled) {
            throw new EmailDeliveryDisabledException(
                    "Email verification is not configured yet. Please try again later."
            );
        }

        LocalDateTime now = LocalDateTime.now();

        EmailVerificationCode verification =
                codeRepository.findByUserIdForUpdate(user.getId())
                        .orElseGet(() -> {
                            EmailVerificationCode created = new EmailVerificationCode();
                            created.setUserId(user.getId());
                            created.setSendCount(0);
                            created.setFailedAttempts(0);
                            return created;
                        });

        LocalDateTime lastSentAt = verification.getLastSentAt();
        if (lastSentAt != null &&
                lastSentAt.plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(now)) {
            throw new RateLimitException(
                    "Please wait a minute before requesting another code."
            );
        }

        LocalDateTime windowStartedAt = verification.getWindowStartedAt();
        int sendCount = verification.getSendCount();

        if (windowStartedAt == null ||
                !windowStartedAt.plusHours(1).isAfter(now)) {
            windowStartedAt = now;
            sendCount = 0;
        }

        if (sendCount >= MAX_SENDS_PER_HOUR) {
            throw new RateLimitException(
                    "You have requested too many codes. Please try again in an hour."
            );
        }

        String code = String.format(
                Locale.ROOT,
                "%06d",
                RANDOM.nextInt(CODE_RANGE)
        );

        verification.setCodeHash(passwordEncoder.encode(code));
        verification.setExpiresAt(now.plusMinutes(CODE_EXPIRY_MINUTES));
        verification.setLastSentAt(now);
        verification.setWindowStartedAt(windowStartedAt);
        verification.setSendCount(sendCount + 1);
        verification.setFailedAttempts(0);

        codeRepository.save(verification);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject("Verify your Football Hub email");
        message.setText(
                "Hi " + user.getUsername() + ",\n\n" +
                "Your Football Hub verification code is: " + code + "\n\n" +
                "This code expires in " + CODE_EXPIRY_MINUTES +
                " minutes. You can request a new code if it expires.\n\n" +
                "If you did not create a Football Hub account, you can ignore this email."
        );

        try {
            mailSender.send(message);
        } catch (MailException e) {
            throw new EmailDeliveryException(
                    "We could not send the verification email. Please try again later.",
                    e
            );
        }
    }

    @Transactional(noRollbackFor = InvalidVerificationCodeException.class)
    public User verifyCode(String email, String submittedCode) {
        if (email == null || email.isBlank() ||
                submittedCode == null ||
                !submittedCode.matches("\\d{6}")) {
            throw new InvalidVerificationCodeException(
                    "Enter the six-digit verification code sent to your email."
            );
        }

        User user = userRepository.findByEmailIgnoreCase(
                        email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new InvalidVerificationCodeException(
                        "The verification code is invalid or has expired."
                ));

        if (user.isEmailVerified()) {
            throw new InvalidVerificationCodeException(
                    "This email address has already been verified. Please log in."
            );
        }

        EmailVerificationCode verification =
                codeRepository.findByUserIdForUpdate(user.getId())
                        .orElseThrow(() -> new InvalidVerificationCodeException(
                                "The verification code is invalid or has expired. Request a new code."
                        ));

        LocalDateTime now = LocalDateTime.now();

        if (verification.getExpiresAt() == null ||
                !verification.getExpiresAt().isAfter(now)) {
            codeRepository.delete(verification);
            throw new InvalidVerificationCodeException(
                    "This code has expired. Request a new one."
            );
        }

        if (verification.getFailedAttempts() >= MAX_CODE_ATTEMPTS) {
            throw new InvalidVerificationCodeException(
                    "Too many incorrect attempts. Request a new verification code."
            );
        }

        if (!passwordEncoder.matches(
                submittedCode,
                verification.getCodeHash())) {
            verification.setFailedAttempts(
                    verification.getFailedAttempts() + 1
            );
            codeRepository.save(verification);

            throw new InvalidVerificationCodeException(
                    verification.getFailedAttempts() >= MAX_CODE_ATTEMPTS
                            ? "Too many incorrect attempts. Request a new verification code."
                            : "That code is incorrect. Please check it and try again."
            );
        }

        user.setEmailVerified(true);
        User verifiedUser = userRepository.save(user);
        codeRepository.delete(verification);

        return verifiedUser;
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

    public static class InvalidVerificationCodeException
            extends IllegalArgumentException {
        public InvalidVerificationCodeException(String message) {
            super(message);
        }
    }
}
