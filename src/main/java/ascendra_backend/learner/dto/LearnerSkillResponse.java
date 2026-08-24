package ascendra_backend.learner.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerSkillResponse {

    private Long id;

    private Long learnerId;

    private Long skillId;

    private String skillName;

    private String category;

    private Integer skillLevel;
}