package ascendra_backend.expert.repository;

import ascendra_backend.expert.entity.ExpertProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpertProfileRepository
        extends JpaRepository<ExpertProfile, Long> {

    Optional<ExpertProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<ExpertProfile> findByAvailableTrue();
}