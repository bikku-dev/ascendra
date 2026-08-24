package ascendra_backend.learner.service;

import ascendra_backend.learner.dto.LearnerProfileRequest;
import ascendra_backend.learner.dto.LearnerProfileResponse;
import ascendra_backend.learner.entity.LearnerProfile;
import ascendra_backend.learner.entity.ExperienceLevel;
import ascendra_backend.learner.mapper.LearnerProfileMapper;
import ascendra_backend.learner.repository.LearnerProfileRepository;
import ascendra_backend.user.entity.Role;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerProfileServiceImpl
        implements LearnerProfileService {

    private final LearnerProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final LearnerProfileMapper profileMapper;

    @Override
    public LearnerProfileResponse createProfile(
            LearnerProfileRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: "
                                        + request.getUserId()
                        )
                );

        if (user.getRole() != Role.LEARNER) {
            throw new RuntimeException(
                    "Only LEARNER user can create learner profile"
            );
        }

        if (profileRepository.existsByUserId(
                request.getUserId())) {

            throw new RuntimeException(
                    "Learner profile already exists"
            );
        }

        LearnerProfile profile = LearnerProfile.builder()
                .user(user)
                .experienceLevel(
                        request.getExperienceLevel()
                )
                .targetRole(
                        request.getTargetRole().trim()
                )
                .bio(request.getBio())
                .build();

        LearnerProfile savedProfile =
                profileRepository.save(profile);

        return profileMapper.toResponse(savedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LearnerProfileResponse> getAllProfiles() {

        return profileRepository.findAll()
                .stream()
                .map(profileMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LearnerProfileResponse getProfileById(Long id) {

        LearnerProfile profile =
                profileRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Learner profile not found: "
                                                + id
                                )
                        );

        return profileMapper.toResponse(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public LearnerProfileResponse getProfileByUserId(
            Long userId) {

        LearnerProfile profile =
                profileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Learner profile not found for user: "
                                                + userId
                                )
                        );

        return profileMapper.toResponse(profile);
    }

    @Override
    public LearnerProfileResponse updateProfile(
            Long id,
            LearnerProfileRequest request) {

        LearnerProfile profile =
                profileRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Learner profile not found: "
                                                + id
                                )
                        );

        User user = userRepository.findById(
                request.getUserId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "User not found with id: "
                                + request.getUserId()
                )
        );

        if (user.getRole() != Role.LEARNER) {
            throw new RuntimeException(
                    "User must have LEARNER role"
            );
        }

        profile.setUser(user);
        profile.setExperienceLevel(
                request.getExperienceLevel()
        );
        profile.setTargetRole(
                request.getTargetRole().trim()
        );
        profile.setBio(request.getBio());

        return profileMapper.toResponse(
                profileRepository.save(profile)
        );
    }

    @Override
    public void deleteProfile(Long id) {

        if (!profileRepository.existsById(id)) {
            throw new RuntimeException(
                    "Learner profile not found: " + id
            );
        }

        profileRepository.deleteById(id);
    }
}