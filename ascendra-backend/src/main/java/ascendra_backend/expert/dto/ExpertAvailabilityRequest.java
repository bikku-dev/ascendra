package ascendra_backend.expert.dto;

import ascendra_backend.expert.entity.DayOfWeek;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class ExpertAvailabilityRequest {

    @NotNull(message = "Expert ID is required")
    private Long expertId;

    @NotNull(message = "Day is required")
    private DayOfWeek dayOfWeek;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;
}