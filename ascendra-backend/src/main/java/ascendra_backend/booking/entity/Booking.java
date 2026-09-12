package ascendra_backend.booking.entity;

import ascendra_backend.expert.entity.ExpertProfile;
import ascendra_backend.learner.entity.LearnerProfile;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "learner_id",
            nullable = false
    )
    private LearnerProfile learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "expert_id",
            nullable = false
    )
    private ExpertProfile expert;

    @Column(
            name = "booking_date",
            nullable = false
    )
    private LocalDate bookingDate;

    @Column(
            name = "start_time",
            nullable = false
    )
    private LocalTime startTime;

    @Column(
            name = "end_time",
            nullable = false
    )
    private LocalTime endTime;

    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status =
            BookingStatus.PENDING_PAYMENT;


    @Column(name = "zoom_meeting_id")
    private String zoomMeetingId;

    @Column(
            name = "zoom_join_url",
            length = 1000
    )
    private String zoomJoinUrl;

    @Column(
            name = "zoom_start_url",
            length = 2000
    )
    private String zoomStartUrl;

    @Column(name = "zoom_password")
    private String zoomPassword;
}