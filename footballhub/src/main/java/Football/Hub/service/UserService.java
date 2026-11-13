package Football.Hub.service;

import Football.Hub.model.User;
import Football.Hub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Pattern USERNAME_PATTERN =
            Pattern.compile("(?=.{3,20}$)[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*");

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9_%+-]+(?:\\.[A-Za-z0-9_%+-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\\.)+[A-Za-z]{2,63}$");

    private static final Pattern GMAIL_USERNAME_PATTERN =
            Pattern.compile("(?=.{6,30}$)[A-Za-z0-9]+(?:\\.[A-Za-z0-9]+)*");

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {

        String username = user.getUsername() == null
                ? ""
                : user.getUsername().trim();

        if (!USERNAME_PATTERN.matcher(username).matches()) {
            throw new IllegalArgumentException(
                    "Username must be 3-20 characters and use letters, numbers, dots, underscores or hyphens. It must start and end with a letter or number.");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        String email = user.getEmail().trim();

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException(
                    "Please enter a valid email address.");
        }

        String emailDomain = email.substring(email.lastIndexOf("@") + 1);

        if ((emailDomain.equalsIgnoreCase("gmail.com") ||
                emailDomain.equalsIgnoreCase("googlemail.com")) &&
                !GMAIL_USERNAME_PATTERN.matcher(
                        email.substring(0, email.lastIndexOf("@"))).matches()) {
            throw new IllegalArgumentException(
                    "Gmail usernames must be 6-30 characters and contain only letters, numbers and single periods.");
        }

        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {
            throw new IllegalArgumentException(
                    "Password is required.");
        }

        if (user.getAge() == null || user.getAge() < 13) {
            throw new IllegalArgumentException(
                    "You must be at least 13 years old.");
        }

        user.setUsername(username);
        user.setEmail(email);

        if (userRepository.existsByUsernameIgnoreCase(
                user.getUsername())) {
            throw new IllegalArgumentException(
                    "Username is already taken.");
        }

        if (userRepository.existsByEmailIgnoreCase(
                user.getEmail())) {
            throw new IllegalArgumentException(
                    "Email is already registered.");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User login(String login, String password) {

        if (login == null || login.isBlank() ||
                password == null || password.isBlank()) {
            throw new IllegalArgumentException(
                    "Username/email and password are required.");
        }

        User user = userRepository
                .findByUsernameIgnoreCase(login.trim())
                .orElseGet(() ->
                        userRepository.findByEmailIgnoreCase(login.trim())
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Invalid login details.")));

        if (!passwordEncoder.matches(
                password, user.getPassword())) {
            throw new IllegalArgumentException(
                    "Invalid login details.");
        }

        return user;
    }

    public User getUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found."));
    }

    public User updateProfile(Long id, User updates) {

        User user = getUser(id);

        String username = updates.getUsername() == null
                ? ""
                : updates.getUsername().trim();

        if (!USERNAME_PATTERN.matcher(username).matches()) {
            throw new IllegalArgumentException(
                    "Username must be 3-20 characters and use letters, numbers, dots, underscores or hyphens. It must start and end with a letter or number.");
        }

        if (userRepository.existsByUsernameIgnoreCaseAndIdNot(username, id)) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        user.setUsername(username);
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