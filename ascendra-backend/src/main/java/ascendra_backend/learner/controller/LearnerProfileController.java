package ascendra_backend.learner.controller;

import ascendra_backend.learner.dto.LearnerProfileRequest;
import ascendra_backend.learner.dto.LearnerProfileResponse;
import ascendra_backend.learner.service.LearnerProfileService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learners")
@RequiredArgsConstructor
public class LearnerProfileController {

    private final LearnerProfileService learnerProfileService;


    @PostMapping
    public ResponseEntity<LearnerProfileResponse> createProfile(
            @Valid @RequestBody LearnerProfileRequest request) {

        LearnerProfileResponse response =
                learnerProfileService.createProfile(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<LearnerProfileResponse>> getAllProfiles() {

        return ResponseEntity.ok(
                learnerProfileService.getAllProfiles()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<LearnerProfileResponse> getProfileById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                learnerProfileService.getProfileById(id)
        );
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<LearnerProfileResponse> getProfileByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                learnerProfileService.getProfileByUserId(userId)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<LearnerProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody LearnerProfileRequest request) {

        return ResponseEntity.ok(
                learnerProfileService.updateProfile(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long id) {

        learnerProfileService.deleteProfile(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}