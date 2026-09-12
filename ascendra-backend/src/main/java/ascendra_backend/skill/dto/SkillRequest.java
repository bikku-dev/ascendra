package ascendra_backend.skill.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SkillRequest {

    @NotBlank(message = "Skill name is required")
    @Size(
            max = 100,
            message = "Skill name cannot exceed 100 characters"
    )
    private String name;

    @NotBlank(message = "Skill category is required")
    @Size(
            max = 100,
            message = "Skill category cannot exceed 100 characters"
    )
    private String category;
}