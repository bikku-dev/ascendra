package ascendra_backend.learner.entity;

import ascendra_backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "learner_profiles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_learner_profile_user",
                        columnNames = "user_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "experience_level",
            nullable = false
    )
    private ExperienceLevel experienceLevel;

    @Column(
            name = "target_role",
            nullable = false,
            length = 100
    )
    private String targetRole;

    @Column(
            name = "bio",
            length = 500
    )
    private String bio;
}