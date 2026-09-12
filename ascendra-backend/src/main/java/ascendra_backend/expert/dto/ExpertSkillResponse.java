package ascendra_backend.expert.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertSkillResponse {

    private Long id;

    private Long expertId;

    private Long skillId;

    private String skillName;

    private String category;

    private Integer skillLevel;
}