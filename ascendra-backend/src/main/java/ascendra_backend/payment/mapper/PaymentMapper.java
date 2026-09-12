package ascendra_backend.payment.mapper;

import ascendra_backend.payment.dto.PaymentResponse;
import ascendra_backend.payment.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(
            Payment payment) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(
                        payment.getBooking().getId()
                )
                .amount(
                        payment.getAmount()
                )
                .transactionId(
                        payment.getTransactionId()
                )
                .status(
                        payment.getStatus()
                )
                .paidAt(
                        payment.getPaidAt()
                )
                .build();
    }
}