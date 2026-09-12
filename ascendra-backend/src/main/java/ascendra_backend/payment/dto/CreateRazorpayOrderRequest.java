package ascendra_backend.payment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateRazorpayOrderRequest {

    @NotNull
    private Long bookingId;
}