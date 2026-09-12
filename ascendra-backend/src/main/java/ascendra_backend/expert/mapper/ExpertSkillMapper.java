package ascendra_backend.expert.mapper;

import ascendra_backend.expert.dto.ExpertSkillResponse;
import ascendra_backend.expert.entity.ExpertSkill;
import org.springframework.stereotype.Component;

@Component
public class ExpertSkillMapper {

    public ExpertSkillResponse toResponse(
            ExpertSkill expertSkill) {

        return ExpertSkillResponse.builder()
                .id(expertSkill.getId())
                .expertId(
                        expertSkill.getExpert().getId()
                )
                .skillId(
                        expertSkill.getSkill().getId()
                )
                .skillName(
                        expertSkill.getSkill().getName()
                )
                .category(
                        expertSkill.getSkill().getCategory()
                )
                .skillLevel(
                        expertSkill.getSkillLevel()
                )
                .build();
    }
}