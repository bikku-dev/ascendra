package ascendra_backend.goal.dto;

import ascendra_backend.goal.entity.GoalStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalResponse {

    private Long id;

    private Long learnerId;

    private String learnerName;

    private String title;

    private String description;

    private GoalStatus status;
}