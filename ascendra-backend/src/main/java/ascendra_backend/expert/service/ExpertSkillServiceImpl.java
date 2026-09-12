package ascendra_backend.expert.service;

import ascendra_backend.expert.dto.ExpertSkillRequest;
import ascendra_backend.expert.dto.ExpertSkillResponse;
import ascendra_backend.expert.entity.ExpertProfile;
import ascendra_backend.expert.entity.ExpertSkill;
import ascendra_backend.expert.mapper.ExpertSkillMapper;
import ascendra_backend.expert.repository.ExpertProfileRepository;
import ascendra_backend.expert.repository.ExpertSkillRepository;
import ascendra_backend.skill.entity.Skill;
import ascendra_backend.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpertSkillServiceImpl
        implements ExpertSkillService {

    private final ExpertSkillRepository expertSkillRepository;

    private final ExpertProfileRepository expertRepository;

    private final SkillRepository skillRepository;

    private final ExpertSkillMapper expertSkillMapper;


    @Override
    public ExpertSkillResponse addSkill(
            ExpertSkillRequest request) {

        ExpertProfile expert =
                expertRepository.findById(
                                request.getExpertId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expert not found with id: "
                                                + request.getExpertId()
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


        if (expertSkillRepository
                .existsByExpertIdAndSkillId(
                        request.getExpertId(),
                        request.getSkillId()
                )) {

            throw new RuntimeException(
                    "This skill is already added to expert"
            );
        }


        ExpertSkill expertSkill =
                ExpertSkill.builder()
                        .expert(expert)
                        .skill(skill)
                        .skillLevel(
                                request.getSkillLevel()
                        )
                        .build();


        ExpertSkill savedSkill =
                expertSkillRepository.save(
                        expertSkill
                );


        return expertSkillMapper.toResponse(
                savedSkill
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<ExpertSkillResponse> getExpertSkills(
            Long expertId) {

        if (!expertRepository.existsById(expertId)) {

            throw new RuntimeException(
                    "Expert not found with id: "
                            + expertId
            );
        }


        return expertSkillRepository
                .findByExpertId(expertId)
                .stream()
                .map(expertSkillMapper::toResponse)
                .toList();
    }


    @Override
    public ExpertSkillResponse updateSkillLevel(
            Long id,
            Integer skillLevel) {

        if (skillLevel < 0 ||
                skillLevel > 100) {

            throw new RuntimeException(
                    "Skill level must be between 0 and 100"
            );
        }


        ExpertSkill expertSkill =
                expertSkillRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expert skill not found with id: "
                                                + id
                                )
                        );


        expertSkill.setSkillLevel(skillLevel);


        return expertSkillMapper.toResponse(
                expertSkillRepository.save(
                        expertSkill
                )
        );
    }


    @Override
    public void removeSkill(Long id) {

        if (!expertSkillRepository.existsById(id)) {

            throw new RuntimeException(
                    "Expert skill not found with id: "
                            + id
            );
        }


        expertSkillRepository.deleteById(id);
    }
}