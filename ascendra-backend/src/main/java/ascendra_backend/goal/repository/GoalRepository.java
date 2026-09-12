package ascendra_backend.goal.repository;

import ascendra_backend.goal.entity.Goal;
import ascendra_backend.goal.entity.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository
        extends JpaRepository<Goal, Long> {

    List<Goal> findByLearnerId(Long learnerId);

    List<Goal> findByLearnerIdAndStatus(
            Long learnerId,
            GoalStatus status
    );
}