package ascendra_backend.learner.repository;

import ascendra_backend.learner.entity.LearnerProfile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LearnerProfileRepository
        extends JpaRepository<LearnerProfile, Long> {

    @Query("""
            SELECT lp
            FROM LearnerProfile lp
            WHERE lp.user.id = :userId
            """)
    Optional<LearnerProfile> findByUserId(
            @Param("userId") Long userId
    );

    boolean existsByUserId(Long userId);
}