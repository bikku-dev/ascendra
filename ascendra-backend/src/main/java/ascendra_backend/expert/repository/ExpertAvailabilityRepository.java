package ascendra_backend.expert.repository;

import ascendra_backend.expert.entity.ExpertAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpertAvailabilityRepository
        extends JpaRepository<ExpertAvailability, Long> {

    List<ExpertAvailability> findByExpertId(
            Long expertId
    );

    List<ExpertAvailability> findByExpertIdAndActiveTrue(
            Long expertId
    );
}