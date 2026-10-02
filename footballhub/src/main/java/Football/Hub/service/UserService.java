package Football.Hub.service;

import Football.Hub.model.User;
import Football.Hub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }

        if (user.getAge() == null || user.getAge() < 13) {
            throw new IllegalArgumentException("You must be at least 13 years old.");
        }

        if (userRepository.existsByUsernameIgnoreCase(user.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User login(String login, String password) {
        if (login == null || login.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("Username/email and password are required.");
        }

        User user = userRepository.findByUsernameIgnoreCase(login)
                .orElseGet(() -> userRepository.findByEmailIgnoreCase(login)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid login details.")));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid login details.");
        }

        return user;
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
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