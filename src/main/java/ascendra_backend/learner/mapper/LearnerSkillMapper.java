package ascendra_backend.learner.mapper;

import ascendra_backend.learner.dto.LearnerSkillResponse;
import ascendra_backend.learner.entity.LearnerSkill;
import org.springframework.stereotype.Component;

@Component
public class LearnerSkillMapper {

    public LearnerSkillResponse toResponse(
            LearnerSkill learnerSkill) {

        return LearnerSkillResponse.builder()
                .id(learnerSkill.getId())
                .learnerId(
                        learnerSkill.getLearner().getId()
                )
                .skillId(
                        learnerSkill.getSkill().getId()
                )
                .skillName(
                        learnerSkill.getSkill().getName()
                )
                .category(
                        learnerSkill.getSkill().getCategory()
                )
                .skillLevel(
                        learnerSkill.getSkillLevel()
                )
                .build();
    }
}