package ascendra_backend.expert.service;

import ascendra_backend.expert.dto.ExpertAvailabilityRequest;
import ascendra_backend.expert.dto.ExpertAvailabilityResponse;

import java.util.List;

public interface ExpertAvailabilityService {

    ExpertAvailabilityResponse addAvailability(
            ExpertAvailabilityRequest request
    );

    List<ExpertAvailabilityResponse> getExpertAvailability(
            Long expertId
    );

    List<ExpertAvailabilityResponse> getActiveAvailability(
            Long expertId
    );

    ExpertAvailabilityResponse updateAvailability(
            Long id,
            ExpertAvailabilityRequest request
    );

    void deactivateAvailability(Long id);

    void deleteAvailability(Long id);
}