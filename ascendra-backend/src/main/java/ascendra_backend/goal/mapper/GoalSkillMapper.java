package ascendra_backend.goal.mapper;

import ascendra_backend.goal.dto.GoalSkillResponse;
import ascendra_backend.goal.entity.GoalSkill;
import org.springframework.stereotype.Component;

@Component
public class GoalSkillMapper {

    public GoalSkillResponse toResponse(
            GoalSkill goalSkill) {

        return GoalSkillResponse.builder()
                .id(goalSkill.getId())
                .goalId(
                        goalSkill.getGoal().getId()
                )
                .skillId(
                        goalSkill.getSkill().getId()
                )
                .skillName(
                        goalSkill.getSkill().getName()
                )
                .category(
                        goalSkill.getSkill().getCategory()
                )
                .requiredLevel(
                        goalSkill.getRequiredLevel()
                )
                .build();
    }
}