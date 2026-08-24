package ascendra_backend.goal.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalSkillResponse {

    private Long id;

    private Long goalId;

    private Long skillId;

    private String skillName;

    private String category;

    private Integer requiredLevel;
}