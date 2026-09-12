package ascendra_backend.skill.service;

import ascendra_backend.skill.dto.SkillRequest;
import ascendra_backend.skill.dto.SkillResponse;

import java.util.List;

public interface SkillService {

    SkillResponse createSkill(SkillRequest request);

    List<SkillResponse> getAllSkills();

    SkillResponse getSkillById(Long id);

    SkillResponse updateSkill(Long id, SkillRequest request);

    void deleteSkill(Long id);
}