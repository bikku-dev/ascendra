package ascendra_backend.goal.service;

import ascendra_backend.goal.dto.GoalRequest;
import ascendra_backend.goal.dto.GoalResponse;

import java.util.List;

public interface GoalService {

    GoalResponse createGoal(
            GoalRequest request
    );

    List<GoalResponse> getLearnerGoals(
            Long learnerId
    );

    GoalResponse getGoalById(
            Long id
    );

    GoalResponse updateGoal(
            Long id,
            GoalRequest request
    );

    GoalResponse updateGoalStatus(
            Long id,
            String status
    );

    void deleteGoal(Long id);
}