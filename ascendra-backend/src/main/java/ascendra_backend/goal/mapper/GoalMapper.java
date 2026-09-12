package ascendra_backend.goal.mapper;

import ascendra_backend.goal.dto.GoalResponse;
import ascendra_backend.goal.entity.Goal;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {

    public GoalResponse toResponse(Goal goal) {

        return GoalResponse.builder()
                .id(goal.getId())
                .learnerId(
                        goal.getLearner().getId()
                )
                .learnerName(
                        goal.getLearner()
                                .getUser()
                                .getName()
                )
                .title(goal.getTitle())
                .description(goal.getDescription())
                .status(goal.getStatus())
                .build();
    }
}