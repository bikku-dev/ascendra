package ascendra_backend.expert.repository;

import ascendra_backend.expert.entity.ExpertSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpertSkillRepository
        extends JpaRepository<ExpertSkill, Long> {

    List<ExpertSkill> findByExpertId(Long expertId);

    boolean existsByExpertIdAndSkillId(
            Long expertId,
            Long skillId
    );
}