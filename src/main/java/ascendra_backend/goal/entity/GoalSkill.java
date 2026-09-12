package ascendra_backend.goal.entity;

import ascendra_backend.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "goal_skills",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_goal_skill",
                        columnNames = {"goal_id", "skill_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private Goal goal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer requiredLevel;
}