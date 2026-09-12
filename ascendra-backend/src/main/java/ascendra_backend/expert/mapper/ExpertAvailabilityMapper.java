package ascendra_backend.expert.mapper;

import ascendra_backend.expert.dto.ExpertAvailabilityResponse;
import ascendra_backend.expert.entity.ExpertAvailability;
import org.springframework.stereotype.Component;

@Component
public class ExpertAvailabilityMapper {

    public ExpertAvailabilityResponse toResponse(
            ExpertAvailability availability) {

        return ExpertAvailabilityResponse.builder()
                .id(availability.getId())
                .expertId(
                        availability.getExpert().getId()
                )
                .dayOfWeek(
                        availability.getDayOfWeek()
                )
                .startTime(
                        availability.getStartTime()
                )
                .endTime(
                        availability.getEndTime()
                )
                .active(
                        availability.getActive()
                )
                .build();
    }
}