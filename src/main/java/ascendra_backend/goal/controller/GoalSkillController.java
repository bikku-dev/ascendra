package ascendra_backend.goal.controller;

import ascendra_backend.goal.dto.GoalSkillRequest;
import ascendra_backend.goal.dto.GoalSkillResponse;
import ascendra_backend.goal.service.GoalSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goal-skills")
@RequiredArgsConstructor
public class GoalSkillController {

    private final GoalSkillService goalSkillService;


    @PostMapping
    public ResponseEntity<GoalSkillResponse> addRequiredSkill(
            @Valid @RequestBody GoalSkillRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        goalSkillService.addRequiredSkill(
                                request
                        )
                );
    }


    @GetMapping("/goal/{goalId}")
    public ResponseEntity<List<GoalSkillResponse>>
    getGoalSkills(
            @PathVariable Long goalId) {

        return ResponseEntity.ok(
                goalSkillService.getGoalSkills(
                        goalId
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<GoalSkillResponse>
    updateRequiredLevel(
            @PathVariable Long id,
            @RequestParam Integer requiredLevel) {

        return ResponseEntity.ok(
                goalSkillService.updateRequiredLevel(
                        id,
                        requiredLevel
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeRequiredSkill(
            @PathVariable Long id) {

        goalSkillService.removeRequiredSkill(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}