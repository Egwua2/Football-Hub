package Football.Hub.dto;

import Football.Hub.model.User;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        Integer age,
        String gender,
        String firstName,
        String lastName,
        String country,
        String favouriteClub,
        String favouritePlayer,
        String favouritePosition,
        String profilePicture,
        LocalDateTime createdAt) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAge(),
                user.getGender(),
                user.getFirstName(),
                user.getLastName(),
                user.getCountry(),
                user.getFavouriteClub(),
                user.getFavouritePlayer(),
                user.getFavouritePosition(),
                user.getProfilePicture(),
                user.getCreatedAt()
        );
    }
}
