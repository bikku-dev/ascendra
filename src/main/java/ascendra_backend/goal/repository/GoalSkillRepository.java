package ascendra_backend.goal.repository;

import ascendra_backend.goal.entity.GoalSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalSkillRepository
        extends JpaRepository<GoalSkill, Long> {

    List<GoalSkill> findByGoalId(Long goalId);

    boolean existsByGoalIdAndSkillId(
            Long goalId,
            Long skillId
    );
}