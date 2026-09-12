package ascendra_backend.learner.entity;

import ascendra_backend.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "learner_skills",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_learner_skill",
                        columnNames = {"learner_id", "skill_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private LearnerProfile learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer skillLevel;
}