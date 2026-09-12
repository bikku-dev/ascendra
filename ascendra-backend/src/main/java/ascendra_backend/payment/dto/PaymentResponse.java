package ascendra_backend.payment.dto;

import ascendra_backend.payment.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;

    private Long bookingId;

    private BigDecimal amount;

    private String transactionId;

    private PaymentStatus status;

    private LocalDateTime paidAt;
}