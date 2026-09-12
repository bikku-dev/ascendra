package ascendra_backend.booking.dto;

import ascendra_backend.booking.entity.BookingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;

    private Long learnerId;

    private String learnerName;

    private Long expertId;

    private String expertName;

    private String professionalTitle;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private BigDecimal amount;

    private BookingStatus status;

    private String zoomMeetingId;

    private String zoomJoinUrl;

    private String zoomStartUrl;

    private String zoomPassword;
}