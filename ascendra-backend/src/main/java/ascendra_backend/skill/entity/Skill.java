package ascendra_backend.skill.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "skills",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_skill_name",
                        columnNames = "name"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            unique = true,
            length = 100
    )
    private String name;

    @Column(
            nullable = false,
            length = 100
    )
    private String category;
}