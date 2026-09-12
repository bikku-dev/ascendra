package ascendra_backend.learner.repository;

import ascendra_backend.learner.entity.LearnerSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearnerSkillRepository
        extends JpaRepository<LearnerSkill, Long> {

    List<LearnerSkill> findByLearnerId(Long learnerId);

    boolean existsByLearnerIdAndSkillId(
            Long learnerId,
            Long skillId
    );
}