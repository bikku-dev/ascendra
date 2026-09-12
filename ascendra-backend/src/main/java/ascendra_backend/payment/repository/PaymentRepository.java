package ascendra_backend.payment.repository;

import ascendra_backend.payment.entity.Payment;
import ascendra_backend.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByTransactionId(
            String transactionId
    );

    boolean existsByBookingId(Long bookingId);

    boolean existsByTransactionId(
            String transactionId
    );
}