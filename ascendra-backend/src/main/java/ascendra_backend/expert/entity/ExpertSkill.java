package ascendra_backend.expert.entity;

import ascendra_backend.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "expert_skills",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_expert_skill",
                        columnNames = {"expert_id", "skill_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expert_id", nullable = false)
    private ExpertProfile expert;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer skillLevel;
}