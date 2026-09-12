package ascendra_backend.skill.service;

import ascendra_backend.skill.dto.SkillRequest;
import ascendra_backend.skill.dto.SkillResponse;
import ascendra_backend.skill.entity.Skill;
import ascendra_backend.skill.mapper.SkillMapper;
import ascendra_backend.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    @Override
    public SkillResponse createSkill(SkillRequest request) {

        if (skillRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new RuntimeException(
                    "Skill already exists: " + request.getName()
            );
        }

        Skill skill = skillMapper.toEntity(request);

        Skill savedSkill = skillRepository.save(skill);

        return skillMapper.toResponse(savedSkill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills() {

        return skillRepository.findAll()
                .stream()
                .map(skillMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SkillResponse getSkillById(Long id) {

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Skill not found with id: " + id
                        )
                );

        return skillMapper.toResponse(skill);
    }

    @Override
    public SkillResponse updateSkill(Long id, SkillRequest request) {

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Skill not found with id: " + id
                        )
                );

        if (skillRepository.existsByNameIgnoreCase(request.getName().trim())
                && !skill.getName().equalsIgnoreCase(request.getName().trim())) {

            throw new RuntimeException(
                    "Skill already exists: " + request.getName()
            );
        }

        skill.setName(request.getName().trim());
        skill.setCategory(request.getCategory().trim());

        Skill updatedSkill = skillRepository.save(skill);

        return skillMapper.toResponse(updatedSkill);
    }

    @Override
    public void deleteSkill(Long id) {

        if (!skillRepository.existsById(id)) {
            throw new RuntimeException(
                    "Skill not found with id: " + id
            );
        }

        skillRepository.deleteById(id);
    }
}