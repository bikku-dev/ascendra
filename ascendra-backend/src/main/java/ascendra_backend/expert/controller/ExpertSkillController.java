package ascendra_backend.expert.controller;

import ascendra_backend.expert.dto.ExpertSkillRequest;
import ascendra_backend.expert.dto.ExpertSkillResponse;
import ascendra_backend.expert.service.ExpertSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expert-skills")
@RequiredArgsConstructor
public class ExpertSkillController {

    private final ExpertSkillService expertSkillService;


    @PostMapping
    public ResponseEntity<ExpertSkillResponse> addSkill(
            @Valid @RequestBody ExpertSkillRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        expertSkillService.addSkill(
                                request
                        )
                );
    }


    @GetMapping("/expert/{expertId}")
    public ResponseEntity<List<ExpertSkillResponse>>
    getExpertSkills(
            @PathVariable Long expertId) {

        return ResponseEntity.ok(
                expertSkillService.getExpertSkills(
                        expertId
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ExpertSkillResponse>
    updateSkillLevel(
            @PathVariable Long id,
            @RequestParam Integer skillLevel) {

        return ResponseEntity.ok(
                expertSkillService.updateSkillLevel(
                        id,
                        skillLevel
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeSkill(
            @PathVariable Long id) {

        expertSkillService.removeSkill(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}