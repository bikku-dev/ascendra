package ascendra_backend.learner.mapper;

import ascendra_backend.learner.dto.LearnerProfileResponse;
import ascendra_backend.learner.entity.LearnerProfile;
import org.springframework.stereotype.Component;

@Component
public class LearnerProfileMapper {

    public LearnerProfileResponse toResponse(
            LearnerProfile profile) {

        return LearnerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .userName(profile.getUser().getName())
                .email(profile.getUser().getEmail())
                .experienceLevel(profile.getExperienceLevel())
                .targetRole(profile.getTargetRole())
                .bio(profile.getBio())
                .build();
    }
}