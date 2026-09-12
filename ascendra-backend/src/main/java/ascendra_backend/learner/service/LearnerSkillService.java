package ascendra_backend.learner.service;

import ascendra_backend.learner.dto.LearnerSkillRequest;
import ascendra_backend.learner.dto.LearnerSkillResponse;

import java.util.List;

public interface LearnerSkillService {

    LearnerSkillResponse addSkill(
            LearnerSkillRequest request
    );

    List<LearnerSkillResponse> getLearnerSkills(
            Long learnerId
    );

    LearnerSkillResponse updateSkillLevel(
            Long id,
            Integer skillLevel
    );

    void removeSkill(Long id);
}