package ascendra_backend.goal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoalSkillRequest {

    @NotNull(message = "Goal ID is required")
    private Long goalId;

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotNull(message = "Required skill level is required")
    @Min(
            value = 0,
            message = "Required level cannot be below 0"
    )
    @Max(
            value = 100,
            message = "Required level cannot exceed 100"
    )
    private Integer requiredLevel;
}