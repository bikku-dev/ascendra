package ascendra_backend.expert.service;

import ascendra_backend.expert.dto.ExpertSkillRequest;
import ascendra_backend.expert.dto.ExpertSkillResponse;

import java.util.List;

public interface ExpertSkillService {

    ExpertSkillResponse addSkill(
            ExpertSkillRequest request
    );

    List<ExpertSkillResponse> getExpertSkills(
            Long expertId
    );

    ExpertSkillResponse updateSkillLevel(
            Long id,
            Integer skillLevel
    );

    void removeSkill(Long id);
}