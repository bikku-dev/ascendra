package ascendra_backend.goal.controller;

import ascendra_backend.goal.dto.GoalRequest;
import ascendra_backend.goal.dto.GoalResponse;
import ascendra_backend.goal.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            @Valid @RequestBody GoalRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        goalService.createGoal(request)
                );
    }

    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<GoalResponse>>
    getLearnerGoals(
            @PathVariable Long learnerId) {

        return ResponseEntity.ok(
                goalService.getLearnerGoals(
                        learnerId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse>
    getGoalById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                goalService.getGoalById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse>
    updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request) {

        return ResponseEntity.ok(
                goalService.updateGoal(
                        id,
                        request
                )
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<GoalResponse>
    updateGoalStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                goalService.updateGoalStatus(
                        id,
                        status
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long id) {

        goalService.deleteGoal(id);

        return ResponseEntity.noContent().build();
    }
}