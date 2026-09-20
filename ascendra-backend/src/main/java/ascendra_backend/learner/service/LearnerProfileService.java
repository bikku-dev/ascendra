package ascendra_backend.learner.service;

import ascendra_backend.learner.dto.LearnerProfileRequest;
import ascendra_backend.learner.dto.LearnerProfileResponse;

import java.util.List;

public interface LearnerProfileService {

    LearnerProfileResponse createProfile(
            LearnerProfileRequest request
    );

    List<LearnerProfileResponse> getAllProfiles();

    LearnerProfileResponse getProfileById(
            Long id
    );

    LearnerProfileResponse getProfileByUserId(
            Long userId
    );

    LearnerProfileResponse updateProfile(
            Long id,
            LearnerProfileRequest request
    );

    void deleteProfile(
            Long id
    );
}