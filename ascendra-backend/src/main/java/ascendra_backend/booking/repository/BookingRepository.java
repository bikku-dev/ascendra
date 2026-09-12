package ascendra_backend.booking.repository;

import ascendra_backend.booking.entity.Booking;
import ascendra_backend.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByLearnerId(Long learnerId);

    List<Booking> findByExpertId(Long expertId);

    List<Booking> findByExpertIdAndBookingDate(
            Long expertId,
            LocalDate bookingDate
    );

    boolean existsByExpertIdAndBookingDateAndStartTimeAndEndTimeAndStatusIn(
            Long expertId,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime,
            List<BookingStatus> statuses
    );

    List<Booking> findByLearnerIdAndStatus(
            Long learnerId,
            BookingStatus status
    );

    @Query("""
            SELECT COUNT(b) > 0
            FROM Booking b
            WHERE b.expert.id = :expertId
              AND b.bookingDate = :bookingDate
              AND b.status IN :statuses
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    boolean existsOverlappingBooking(
            @Param("expertId") Long expertId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") List<BookingStatus> statuses
    );
}