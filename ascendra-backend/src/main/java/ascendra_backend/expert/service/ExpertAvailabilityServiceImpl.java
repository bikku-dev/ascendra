package ascendra_backend.expert.service;

import ascendra_backend.expert.dto.ExpertAvailabilityRequest;
import ascendra_backend.expert.dto.ExpertAvailabilityResponse;
import ascendra_backend.expert.entity.ExpertAvailability;
import ascendra_backend.expert.entity.ExpertProfile;
import ascendra_backend.expert.mapper.ExpertAvailabilityMapper;
import ascendra_backend.expert.repository.ExpertAvailabilityRepository;
import ascendra_backend.expert.repository.ExpertProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpertAvailabilityServiceImpl
        implements ExpertAvailabilityService {

    private final ExpertAvailabilityRepository
            availabilityRepository;

    private final ExpertProfileRepository
            expertRepository;

    private final ExpertAvailabilityMapper
            availabilityMapper;


    @Override
    public ExpertAvailabilityResponse addAvailability(
            ExpertAvailabilityRequest request) {

        validateTime(
                request.getStartTime(),
                request.getEndTime()
        );

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


        ExpertAvailability availability =
                ExpertAvailability.builder()
                        .expert(expert)
                        .dayOfWeek(
                                request.getDayOfWeek()
                        )
                        .startTime(
                                request.getStartTime()
                        )
                        .endTime(
                                request.getEndTime()
                        )
                        .active(true)
                        .build();


        return availabilityMapper.toResponse(
                availabilityRepository.save(
                        availability
                )
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<ExpertAvailabilityResponse>
    getExpertAvailability(
            Long expertId) {

        if (!expertRepository.existsById(expertId)) {

            throw new RuntimeException(
                    "Expert not found with id: "
                            + expertId
            );
        }

        return availabilityRepository
                .findByExpertId(expertId)
                .stream()
                .map(availabilityMapper::toResponse)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<ExpertAvailabilityResponse>
    getActiveAvailability(
            Long expertId) {

        if (!expertRepository.existsById(expertId)) {

            throw new RuntimeException(
                    "Expert not found with id: "
                            + expertId
            );
        }

        return availabilityRepository
                .findByExpertIdAndActiveTrue(
                        expertId
                )
                .stream()
                .map(availabilityMapper::toResponse)
                .toList();
    }


    @Override
    public ExpertAvailabilityResponse updateAvailability(
            Long id,
            ExpertAvailabilityRequest request) {

        validateTime(
                request.getStartTime(),
                request.getEndTime()
        );

        ExpertAvailability availability =
                availabilityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Availability not found with id: "
                                                + id
                                )
                        );


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


        availability.setExpert(expert);

        availability.setDayOfWeek(
                request.getDayOfWeek()
        );

        availability.setStartTime(
                request.getStartTime()
        );

        availability.setEndTime(
                request.getEndTime()
        );


        return availabilityMapper.toResponse(
                availabilityRepository.save(
                        availability
                )
        );
    }


    @Override
    public void deactivateAvailability(Long id) {

        ExpertAvailability availability =
                availabilityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Availability not found with id: "
                                                + id
                                )
                        );

        availability.setActive(false);

        availabilityRepository.save(
                availability
        );
    }


    @Override
    public void deleteAvailability(Long id) {

        if (!availabilityRepository.existsById(id)) {

            throw new RuntimeException(
                    "Availability not found with id: "
                            + id
            );
        }

        availabilityRepository.deleteById(id);
    }


    private void validateTime(
            java.time.LocalTime startTime,
            java.time.LocalTime endTime) {

        if (!startTime.isBefore(endTime)) {

            throw new RuntimeException(
                    "Start time must be before end time"
            );
        }
    }
}