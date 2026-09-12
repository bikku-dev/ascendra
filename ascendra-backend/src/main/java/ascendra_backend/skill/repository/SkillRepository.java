package ascendra_backend.skill.repository;

import ascendra_backend.skill.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository
        extends JpaRepository<Skill, Long> {

    boolean existsByNameIgnoreCase(
            String name
    );
}