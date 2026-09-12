package ascendra_backend.booking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class BookingRequest {

    @NotNull(message = "Learner ID is required")
    private Long learnerId;

    @NotNull(message = "Expert ID is required")
    private Long expertId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Amount is required")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "Amount cannot be negative"
    )
    private BigDecimal amount;
}