package Football.Hub.service;

import Football.Hub.model.User;
import Football.Hub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(
            String username,
            String email,
            String password) {

        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException(
                    "Password must be at least 6 characters."
            );
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException(
                    "Username is already taken."
            );
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email is already registered."
            );
        }

        User user = new User(
                username,
                email,
                passwordEncoder.encode(password)
        );

        return userRepository.save(user);
    }

    public User login(
            String usernameOrEmail,
            String password) {

        User user = userRepository
                .findByUsername(usernameOrEmail)
                .orElseGet(() ->
                        userRepository
                                .findByEmail(usernameOrEmail)
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Invalid username/email or password."
                                        )
                                )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid username/email or password."
            );
        }

        return user;
    }
}