package ascendra_backend.payment.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderResponse {

    private Long paymentId;

    private Long bookingId;

    private String razorpayOrderId;

    private String razorpayKeyId;

    private Long amount;

    private String currency;

    private String status;
}