package ascendra_backend.learner.dto;

import ascendra_backend.learner.entity.ExperienceLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LearnerProfileRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Experience level is required")
    private ExperienceLevel experienceLevel;

    @NotBlank(message = "Target role is required")
    @Size(max = 100, message = "Target role must not exceed 100 characters")
    private String targetRole;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;
}