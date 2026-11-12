package Football.Hub.repository;

import Football.Hub.model.EmailVerificationCode;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EmailVerificationCodeRepository
        extends JpaRepository<EmailVerificationCode, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select code from EmailVerificationCode code where code.userId = :userId")
    Optional<EmailVerificationCode> findByUserIdForUpdate(
            @Param("userId") Long userId
    );

    Optional<EmailVerificationCode> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
