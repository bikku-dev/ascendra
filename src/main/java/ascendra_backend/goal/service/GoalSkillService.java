package ascendra_backend.goal.service;

import ascendra_backend.goal.dto.GoalSkillRequest;
import ascendra_backend.goal.dto.GoalSkillResponse;

import java.util.List;

public interface GoalSkillService {

    GoalSkillResponse addRequiredSkill(
            GoalSkillRequest request
    );

    List<GoalSkillResponse> getGoalSkills(
            Long goalId
    );

    GoalSkillResponse updateRequiredLevel(
            Long id,
            Integer requiredLevel
    );

    void removeRequiredSkill(Long id);
}