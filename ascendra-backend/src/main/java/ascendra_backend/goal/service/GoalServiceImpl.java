package ascendra_backend.goal.service;

import ascendra_backend.goal.dto.GoalRequest;
import ascendra_backend.goal.dto.GoalResponse;
import ascendra_backend.goal.entity.Goal;
import ascendra_backend.goal.entity.GoalStatus;
import ascendra_backend.goal.mapper.GoalMapper;
import ascendra_backend.goal.repository.GoalRepository;
import ascendra_backend.learner.entity.LearnerProfile;
import ascendra_backend.learner.repository.LearnerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;

    private final LearnerProfileRepository
            learnerProfileRepository;

    private final GoalMapper goalMapper;

    @Override
    public GoalResponse createGoal(
            GoalRequest request) {

        LearnerProfile learner =
                learnerProfileRepository.findById(
                                request.getLearnerId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Learner not found with id: "
                                                + request.getLearnerId()
                                )
                        );

        Goal goal = Goal.builder()
                .learner(learner)
                .title(request.getTitle().trim())
                .description(
                        request.getDescription().trim()
                )
                .status(GoalStatus.ACTIVE)
                .build();

        Goal savedGoal =
                goalRepository.save(goal);

        return goalMapper.toResponse(savedGoal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoalResponse> getLearnerGoals(
            Long learnerId) {

        if (!learnerProfileRepository
                .existsById(learnerId)) {

            throw new RuntimeException(
                    "Learner not found with id: "
                            + learnerId
            );
        }

        return goalRepository
                .findByLearnerId(learnerId)
                .stream()
                .map(goalMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GoalResponse getGoalById(Long id) {

        Goal goal =
                goalRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Goal not found with id: "
                                                + id
                                )
                        );

        return goalMapper.toResponse(goal);
    }

    @Override
    public GoalResponse updateGoal(
            Long id,
            GoalRequest request) {

        Goal goal =
                goalRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Goal not found with id: "
                                                + id
                                )
                        );

        LearnerProfile learner =
                learnerProfileRepository.findById(
                                request.getLearnerId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Learner not found with id: "
                                                + request.getLearnerId()
                                )
                        );

        goal.setLearner(learner);
        goal.setTitle(request.getTitle().trim());
        goal.setDescription(
                request.getDescription().trim()
        );

        return goalMapper.toResponse(
                goalRepository.save(goal)
        );
    }

    @Override
    public GoalResponse updateGoalStatus(
            Long id,
            String status) {

        Goal goal =
                goalRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Goal not found with id: "
                                                + id
                                )
                        );

        GoalStatus goalStatus;

        try {
            goalStatus = GoalStatus.valueOf(
                    status.toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                    "Invalid status. Use ACTIVE, COMPLETED or CANCELLED"
            );
        }

        goal.setStatus(goalStatus);

        return goalMapper.toResponse(
                goalRepository.save(goal)
        );
    }

    @Override
    public void deleteGoal(Long id) {

        if (!goalRepository.existsById(id)) {
            throw new RuntimeException(
                    "Goal not found with id: " + id
            );
        }

        goalRepository.deleteById(id);
    }
}