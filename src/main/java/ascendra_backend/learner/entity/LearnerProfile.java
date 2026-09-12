package ascendra_backend.learner.entity;

import ascendra_backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "learner_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExperienceLevel experienceLevel;

    @Column(nullable = false, length = 100)
    private String targetRole;

    @Column(length = 500)
    private String bio;
}