package ascendra_backend.learner.dto;

import ascendra_backend.learner.entity.ExperienceLevel;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerProfileResponse {

    private Long id;

    private Long userId;

    private String userName;

    private String email;

    private ExperienceLevel experienceLevel;

    private String targetRole;

    private String bio;
}