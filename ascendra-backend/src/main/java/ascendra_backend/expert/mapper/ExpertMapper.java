package ascendra_backend.expert.mapper;

import ascendra_backend.expert.dto.ExpertResponse;
import ascendra_backend.expert.entity.ExpertProfile;
import org.springframework.stereotype.Component;

@Component
public class ExpertMapper {

    public ExpertResponse toResponse(
            ExpertProfile expert) {

        return ExpertResponse.builder()
                .id(expert.getId())
                .userId(
                        expert.getUser().getId()
                )
                .userName(
                        expert.getUser().getName()
                )
                .email(
                        expert.getUser().getEmail()
                )
                .professionalTitle(
                        expert.getProfessionalTitle()
                )
                .bio(
                        expert.getBio()
                )
                .experienceYears(
                        expert.getExperienceYears()
                )
                .hourlyRate(
                        expert.getHourlyRate()
                )
                .rating(
                        expert.getRating()
                )
                .available(
                        expert.getAvailable()
                )
                .build();
    }
}