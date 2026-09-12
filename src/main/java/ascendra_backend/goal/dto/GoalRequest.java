package ascendra_backend.goal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoalRequest {

    @NotNull(message = "Learner ID is required")
    private Long learnerId;

    @NotBlank(message = "Goal title is required")
    @Size(max = 150)
    private String title;

    @NotBlank(message = "Goal description is required")
    @Size(max = 1000)
    private String description;
}