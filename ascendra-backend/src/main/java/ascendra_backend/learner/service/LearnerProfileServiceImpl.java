package ascendra_backend.learner.service;

import ascendra_backend.learner.dto.LearnerProfileRequest;
import ascendra_backend.learner.dto.LearnerProfileResponse;
import ascendra_backend.learner.entity.LearnerProfile;
import ascendra_backend.learner.mapper.LearnerProfileMapper;
import ascendra_backend.learner.repository.LearnerProfileRepository;
import ascendra_backend.user.entity.Role;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Profile request is required"
            );
        }

        if (request.getUserId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User ID is required"
            );
        }

        if (request.getExperienceLevel() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Experience level is required"
            );
        }

        if (request.getTargetRole() == null ||
                request.getTargetRole().trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Target role is required"
            );
        }

        User user =
                userRepository.findById(
                        request.getUserId()
                ).orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found with id: "
                                        + request.getUserId()
                        )
                );

        if (user.getRole() != Role.LEARNER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only LEARNER users can create learner profile"
            );
        }

        if (profileRepository.existsByUserId(
                request.getUserId()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Learner profile already exists"
            );
        }

        String bio =
                request.getBio() == null
                        ? null
                        : request.getBio().trim();

        LearnerProfile profile =
                LearnerProfile.builder()
                        .user(user)
                        .experienceLevel(
                                request.getExperienceLevel()
                        )
                        .targetRole(
                                request.getTargetRole().trim()
                        )
                        .bio(bio)
                        .build();

        LearnerProfile saved =
                profileRepository.save(profile);

        return profileMapper.toResponse(saved);
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
    public LearnerProfileResponse getProfileById(
            Long id) {

        LearnerProfile profile =
                profileRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
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

        if (userId == null) {
            return null;
        }

        return profileRepository
                .findByUserId(userId)
                .map(profileMapper::toResponse)
                .orElse(null);
    }

    @Override
    public LearnerProfileResponse updateProfile(
            Long id,
            LearnerProfileRequest request) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Profile request is required"
            );
        }

        if (request.getUserId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User ID is required"
            );
        }

        if (request.getExperienceLevel() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Experience level is required"
            );
        }

        if (request.getTargetRole() == null ||
                request.getTargetRole().trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Target role is required"
            );
        }

        LearnerProfile profile =
                profileRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Learner profile not found: "
                                                + id
                                )
                        );

        User user =
                userRepository.findById(
                        request.getUserId()
                ).orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found with id: "
                                        + request.getUserId()
                        )
                );

        if (user.getRole() != Role.LEARNER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
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

        profile.setBio(
                request.getBio() == null
                        ? null
                        : request.getBio().trim()
        );

        return profileMapper.toResponse(
                profileRepository.save(profile)
        );
    }

    @Override
    public void deleteProfile(Long id) {

        if (!profileRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Learner profile not found: " + id
            );
        }

        profileRepository.deleteById(id);
    }
}