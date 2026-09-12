package ascendra_backend.expert.service;

import ascendra_backend.expert.dto.ExpertRequest;
import ascendra_backend.expert.dto.ExpertResponse;
import ascendra_backend.expert.entity.ExpertProfile;
import ascendra_backend.expert.mapper.ExpertMapper;
import ascendra_backend.expert.repository.ExpertProfileRepository;
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
public class ExpertServiceImpl implements ExpertService {

    private final ExpertProfileRepository expertRepository;

    private final UserRepository userRepository;

    private final ExpertMapper expertMapper;


    @Override
    public ExpertResponse createExpert(
            ExpertRequest request) {

        User user =
                userRepository.findById(
                                request.getUserId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + request.getUserId()
                                )
                        );


        if (user.getRole() != Role.EXPERT) {

            throw new RuntimeException(
                    "Only EXPERT user can create expert profile"
            );
        }


        if (expertRepository.existsByUserId(
                request.getUserId()
        )) {

            throw new RuntimeException(
                    "Expert profile already exists"
            );
        }


        ExpertProfile expert =
                ExpertProfile.builder()
                        .user(user)
                        .professionalTitle(
                                request.getProfessionalTitle()
                                        .trim()
                        )
                        .bio(
                                request.getBio().trim()
                        )
                        .experienceYears(
                                request.getExperienceYears()
                        )
                        .hourlyRate(
                                request.getHourlyRate()
                        )
                        .rating(0.0)
                        .available(
                                request.getAvailable() != null
                                        ? request.getAvailable()
                                        : true
                        )
                        .build();


        ExpertProfile savedExpert =
                expertRepository.save(expert);


        return expertMapper.toResponse(
                savedExpert
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<ExpertResponse> getAllExperts() {

        return expertRepository.findAll()
                .stream()
                .map(expertMapper::toResponse)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<ExpertResponse> getAvailableExperts() {

        return expertRepository
                .findByAvailableTrue()
                .stream()
                .map(expertMapper::toResponse)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public ExpertResponse getExpertById(
            Long id) {

        ExpertProfile expert =
                expertRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expert not found with id: "
                                                + id
                                )
                        );

        return expertMapper.toResponse(expert);
    }


    @Override
    @Transactional(readOnly = true)
    public ExpertResponse getExpertByUserId(
            Long userId) {

        ExpertProfile expert =
                expertRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expert profile not found for user id: "
                                                + userId
                                )
                        );

        return expertMapper.toResponse(expert);
    }


    @Override
    public ExpertResponse updateExpert(
            Long id,
            ExpertRequest request) {

        ExpertProfile expert =
                expertRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expert not found with id: "
                                                + id
                                )
                        );


        User user =
                userRepository.findById(
                                request.getUserId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + request.getUserId()
                                )
                        );


        if (user.getRole() != Role.EXPERT) {

            throw new RuntimeException(
                    "User must have EXPERT role"
            );
        }


        expert.setUser(user);

        expert.setProfessionalTitle(
                request.getProfessionalTitle().trim()
        );

        expert.setBio(
                request.getBio().trim()
        );

        expert.setExperienceYears(
                request.getExperienceYears()
        );

        expert.setHourlyRate(
                request.getHourlyRate()
        );

        if (request.getAvailable() != null) {
            expert.setAvailable(
                    request.getAvailable()
            );
        }


        return expertMapper.toResponse(
                expertRepository.save(expert)
        );
    }


    @Override
    public void deleteExpert(Long id) {

        if (!expertRepository.existsById(id)) {

            throw new RuntimeException(
                    "Expert not found with id: " + id
            );
        }

        expertRepository.deleteById(id);
    }
}