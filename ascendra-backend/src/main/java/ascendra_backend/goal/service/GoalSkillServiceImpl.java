package ascendra_backend.goal.service;

import ascendra_backend.goal.dto.GoalSkillRequest;
import ascendra_backend.goal.dto.GoalSkillResponse;
import ascendra_backend.goal.entity.Goal;
import ascendra_backend.goal.entity.GoalSkill;
import ascendra_backend.goal.mapper.GoalSkillMapper;
import ascendra_backend.goal.repository.GoalRepository;
import ascendra_backend.goal.repository.GoalSkillRepository;
import ascendra_backend.skill.entity.Skill;
import ascendra_backend.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GoalSkillServiceImpl
        implements GoalSkillService {

    private final GoalSkillRepository goalSkillRepository;

    private final GoalRepository goalRepository;

    private final SkillRepository skillRepository;

    private final GoalSkillMapper goalSkillMapper;


    @Override
    public GoalSkillResponse addRequiredSkill(
            GoalSkillRequest request) {

        Goal goal =
                goalRepository.findById(
                                request.getGoalId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Goal not found with id: "
                                                + request.getGoalId()
                                )
                        );


        Skill skill =
                skillRepository.findById(
                                request.getSkillId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skill not found with id: "
                                                + request.getSkillId()
                                )
                        );


        if (goalSkillRepository
                .existsByGoalIdAndSkillId(
                        request.getGoalId(),
                        request.getSkillId()
                )) {

            throw new RuntimeException(
                    "This skill is already added to the goal"
            );
        }


        GoalSkill goalSkill =
                GoalSkill.builder()
                        .goal(goal)
                        .skill(skill)
                        .requiredLevel(
                                request.getRequiredLevel()
                        )
                        .build();


        GoalSkill savedGoalSkill =
                goalSkillRepository.save(
                        goalSkill
                );


        return goalSkillMapper.toResponse(
                savedGoalSkill
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<GoalSkillResponse> getGoalSkills(
            Long goalId) {

        if (!goalRepository.existsById(goalId)) {

            throw new RuntimeException(
                    "Goal not found with id: " + goalId
            );
        }


        return goalSkillRepository
                .findByGoalId(goalId)
                .stream()
                .map(goalSkillMapper::toResponse)
                .toList();
    }


    @Override
    public GoalSkillResponse updateRequiredLevel(
            Long id,
            Integer requiredLevel) {

        if (requiredLevel < 0 ||
                requiredLevel > 100) {

            throw new RuntimeException(
                    "Required level must be between 0 and 100"
            );
        }


        GoalSkill goalSkill =
                goalSkillRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Goal skill not found with id: "
                                                + id
                                )
                        );


        goalSkill.setRequiredLevel(
                requiredLevel
        );


        return goalSkillMapper.toResponse(
                goalSkillRepository.save(
                        goalSkill
                )
        );
    }


    @Override
    public void removeRequiredSkill(Long id) {

        if (!goalSkillRepository.existsById(id)) {

            throw new RuntimeException(
                    "Goal skill not found with id: "
                            + id
            );
        }


        goalSkillRepository.deleteById(id);
    }
}
