package ascendra_backend.expert.service;

import ascendra_backend.expert.dto.ExpertRequest;
import ascendra_backend.expert.dto.ExpertResponse;

import java.util.List;

public interface ExpertService {

    ExpertResponse createExpert(
            ExpertRequest request
    );

    List<ExpertResponse> getAllExperts();

    List<ExpertResponse> getAvailableExperts();

    ExpertResponse getExpertById(Long id);

    ExpertResponse getExpertByUserId(Long userId);

    ExpertResponse updateExpert(
            Long id,
            ExpertRequest request
    );

    void deleteExpert(Long id);
}