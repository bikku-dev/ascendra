package ascendra_backend.skill.mapper;

import ascendra_backend.skill.dto.SkillRequest;
import ascendra_backend.skill.dto.SkillResponse;
import ascendra_backend.skill.entity.Skill;
import org.springframework.stereotype.Component;

@Component
public class SkillMapper {

    public Skill toEntity(SkillRequest request) {

        return Skill.builder()
                .name(request.getName().trim())
                .category(request.getCategory().trim())
                .build();
    }

    public SkillResponse toResponse(Skill skill) {

        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .build();
    }
}