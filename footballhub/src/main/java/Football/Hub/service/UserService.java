package Football.Hub.service;

import Football.Hub.model.User;
import Football.Hub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$");

    private static final Pattern USERNAME_PATTERN =
            Pattern.compile("^[A-Za-z0-9_]{3,20}$");

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailVerificationService emailVerificationService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
    }

    @Transactional
    public User register(User user) {

        if (user.getUsername() == null ||
                !USERNAME_PATTERN.matcher(user.getUsername().trim()).matches()) {
            throw new IllegalArgumentException(
                    "Username must be 3–20 characters and contain only letters, numbers or underscores."
            );
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        String email = user.getEmail().trim().toLowerCase(Locale.ROOT);

        if (email.length() > 254 ||
                !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException(
                    "Please enter a valid email address."
            );
        }

        String password = user.getPassword();
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }

        int passwordBytes = password.getBytes(StandardCharsets.UTF_8).length;
        if (password.length() < 8 || passwordBytes > 72) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters and no more than 72 bytes."
            );
        }

        if (user.getAge() == null || user.getAge() < 13 || user.getAge() > 120) {
            throw new IllegalArgumentException(
                    "You must be between 13 and 120 years old."
            );
        }

        user.setUsername(user.getUsername().trim());
        user.setEmail(email);

        if (userRepository.existsByUsernameIgnoreCase(user.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);
        emailVerificationService.sendCode(savedUser);

        return savedUser;
    }

    public User login(String login, String password) {

        if (login == null || login.isBlank() ||
                password == null || password.isBlank()) {
            throw new IllegalArgumentException(
                    "Username/email and password are required."
            );
        }

        User user = userRepository
                .findByUsernameIgnoreCase(login.trim())
                .orElseGet(() ->
                        userRepository.findByEmailIgnoreCase(login.trim())
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Invalid login details."
                                        )));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid login details.");
        }

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException(user.getEmail());
        }

        return user;
    }

    public User verifyEmail(String email, String code) {
        return emailVerificationService.verifyCode(email, code);
    }

    public void resendVerification(String email) {
        if (email == null || email.isBlank()) {
            return;
        }

        userRepository.findByEmailIgnoreCase(email.trim())
                .filter(user -> !user.isEmailVerified())
                .ifPresent(emailVerificationService::sendCode);
    }

    public User getUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));
    }

    public User updateProfile(Long id, User updates) {

        User user = getUser(id);

        user.setAge(updates.getAge());
        user.setGender(updates.getGender());
        user.setFirstName(updates.getFirstName());
        user.setLastName(updates.getLastName());
        user.setCountry(updates.getCountry());
        user.setFavouriteClub(updates.getFavouriteClub());
        user.setFavouritePlayer(updates.getFavouritePlayer());
        user.setFavouritePosition(updates.getFavouritePosition());
        user.setProfilePicture(updates.getProfilePicture());

        return userRepository.save(user);
    }
}
