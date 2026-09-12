package ascendra_backend.expert.controller;

import ascendra_backend.expert.dto.ExpertAvailabilityRequest;
import ascendra_backend.expert.dto.ExpertAvailabilityResponse;
import ascendra_backend.expert.service.ExpertAvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expert-availability")
@RequiredArgsConstructor
public class ExpertAvailabilityController {

    private final ExpertAvailabilityService
            availabilityService;


    @PostMapping
    public ResponseEntity<ExpertAvailabilityResponse>
    addAvailability(
            @Valid @RequestBody
            ExpertAvailabilityRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        availabilityService.addAvailability(
                                request
                        )
                );
    }


    @GetMapping("/expert/{expertId}")
    public ResponseEntity<
            List<ExpertAvailabilityResponse>>
    getExpertAvailability(
            @PathVariable Long expertId) {

        return ResponseEntity.ok(
                availabilityService.getExpertAvailability(
                        expertId
                )
        );
    }


    @GetMapping("/expert/{expertId}/active")
    public ResponseEntity<
            List<ExpertAvailabilityResponse>>
    getActiveAvailability(
            @PathVariable Long expertId) {

        return ResponseEntity.ok(
                availabilityService.getActiveAvailability(
                        expertId
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ExpertAvailabilityResponse>
    updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody
            ExpertAvailabilityRequest request) {

        return ResponseEntity.ok(
                availabilityService.updateAvailability(
                        id,
                        request
                )
        );
    }


    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void>
    deactivateAvailability(
            @PathVariable Long id) {

        availabilityService.deactivateAvailability(
                id
        );

        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteAvailability(
            @PathVariable Long id) {

        availabilityService.deleteAvailability(id);

        return ResponseEntity.noContent().build();
    }
}