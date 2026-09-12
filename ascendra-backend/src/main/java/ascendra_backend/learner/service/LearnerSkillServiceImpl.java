package ascendra_backend.learner.service;

import ascendra_backend.learner.dto.LearnerSkillRequest;
import ascendra_backend.learner.dto.LearnerSkillResponse;
import ascendra_backend.learner.entity.LearnerProfile;
import ascendra_backend.learner.entity.LearnerSkill;
import ascendra_backend.learner.mapper.LearnerSkillMapper;
import ascendra_backend.learner.repository.LearnerProfileRepository;
import ascendra_backend.learner.repository.LearnerSkillRepository;
import ascendra_backend.skill.entity.Skill;
import ascendra_backend.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerSkillServiceImpl
        implements LearnerSkillService {

    private final LearnerSkillRepository learnerSkillRepository;

    private final LearnerProfileRepository learnerProfileRepository;

    private final SkillRepository skillRepository;

    private final LearnerSkillMapper learnerSkillMapper;


    @Override
    public LearnerSkillResponse addSkill(
            LearnerSkillRequest request) {

        LearnerProfile learner =
                learnerProfileRepository.findById(
                        request.getLearnerId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Learner not found with id: "
                                        + request.getLearnerId()
                        )
                );


        Skill skill =
                skillRepository.findById(
                        request.getSkillId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Skill not found with id: "
                                        + request.getSkillId()
                        )
                );


        if (learnerSkillRepository
                .existsByLearnerIdAndSkillId(
                        request.getLearnerId(),
                        request.getSkillId()
                )) {

            throw new RuntimeException(
                    "This skill is already added to learner"
            );
        }


        LearnerSkill learnerSkill =
                LearnerSkill.builder()
                        .learner(learner)
                        .skill(skill)
                        .skillLevel(
                                request.getSkillLevel()
                        )
                        .build();


        LearnerSkill savedSkill =
                learnerSkillRepository.save(
                        learnerSkill
                );


        return learnerSkillMapper.toResponse(
                savedSkill
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<LearnerSkillResponse> getLearnerSkills(
            Long learnerId) {

        if (!learnerProfileRepository.existsById(learnerId)) {

            throw new RuntimeException(
                    "Learner not found with id: "
                            + learnerId
            );
        }


        return learnerSkillRepository
                .findByLearnerId(learnerId)
                .stream()
                .map(learnerSkillMapper::toResponse)
                .toList();
    }


    @Override
    public LearnerSkillResponse updateSkillLevel(
            Long id,
            Integer skillLevel) {

        if (skillLevel < 0 || skillLevel > 100) {

            throw new RuntimeException(
                    "Skill level must be between 0 and 100"
            );
        }


        LearnerSkill learnerSkill =
                learnerSkillRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Learner skill not found with id: "
                                                + id
                                )
                        );


        learnerSkill.setSkillLevel(skillLevel);


        return learnerSkillMapper.toResponse(
                learnerSkillRepository.save(
                        learnerSkill
                )
        );
    }


    @Override
    public void removeSkill(Long id) {

        if (!learnerSkillRepository.existsById(id)) {

            throw new RuntimeException(
                    "Learner skill not found with id: "
                            + id
            );
        }


        learnerSkillRepository.deleteById(id);
    }
}