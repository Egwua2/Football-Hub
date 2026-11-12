package Football.Hub.repository;

import Football.Hub.model.PasswordResetCode;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PasswordResetCodeRepository
        extends JpaRepository<PasswordResetCode, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select code from PasswordResetCode code where code.userId = :userId")
    Optional<PasswordResetCode> findByUserIdForUpdate(
            @Param("userId") Long userId
    );

    Optional<PasswordResetCode> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
