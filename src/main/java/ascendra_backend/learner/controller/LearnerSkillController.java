package ascendra_backend.learner.controller;

import ascendra_backend.learner.dto.LearnerSkillRequest;
import ascendra_backend.learner.dto.LearnerSkillResponse;
import ascendra_backend.learner.service.LearnerSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-skills")
@RequiredArgsConstructor
public class LearnerSkillController {

    private final LearnerSkillService learnerSkillService;


    @PostMapping
    public ResponseEntity<LearnerSkillResponse> addSkill(
            @Valid @RequestBody LearnerSkillRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        learnerSkillService.addSkill(
                                request
                        )
                );
    }


    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<LearnerSkillResponse>>
    getLearnerSkills(
            @PathVariable Long learnerId) {

        return ResponseEntity.ok(
                learnerSkillService.getLearnerSkills(
                        learnerId
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<LearnerSkillResponse>
    updateSkillLevel(
            @PathVariable Long id,
            @RequestParam Integer skillLevel) {

        return ResponseEntity.ok(
                learnerSkillService.updateSkillLevel(
                        id,
                        skillLevel
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeSkill(
            @PathVariable Long id) {

        learnerSkillService.removeSkill(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}