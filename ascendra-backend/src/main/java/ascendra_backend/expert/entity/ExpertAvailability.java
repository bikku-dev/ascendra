package ascendra_backend.expert.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(
        name = "expert_availability",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_expert_day_time",
                        columnNames = {
                                "expert_id",
                                "day_of_week",
                                "start_time",
                                "end_time"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "expert_id",
            nullable = false
    )
    private ExpertProfile expert;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "day_of_week",
            nullable = false
    )
    private DayOfWeek dayOfWeek;

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

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}