package ascendra_backend.expert.dto;

import ascendra_backend.expert.entity.DayOfWeek;
import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertAvailabilityResponse {

    private Long id;

    private Long expertId;

    private DayOfWeek dayOfWeek;

    private LocalTime startTime;

    private LocalTime endTime;

    private Boolean active;
}