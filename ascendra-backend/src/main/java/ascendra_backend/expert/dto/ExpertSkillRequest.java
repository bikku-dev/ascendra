package ascendra_backend.expert.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpertSkillRequest {

    @NotNull(message = "Expert ID is required")
    private Long expertId;

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotNull(message = "Skill level is required")
    @Min(
            value = 0,
            message = "Skill level cannot be below 0"
    )
    @Max(
            value = 100,
            message = "Skill level cannot exceed 100"
    )
    private Integer skillLevel;
}