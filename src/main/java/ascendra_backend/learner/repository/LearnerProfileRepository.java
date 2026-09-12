package ascendra_backend.learner.repository;

import ascendra_backend.learner.entity.LearnerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LearnerProfileRepository
        extends JpaRepository<LearnerProfile, Long> {

    Optional<LearnerProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}