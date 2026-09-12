package ascendra_backend.expert.controller;

import ascendra_backend.expert.dto.ExpertRequest;
import ascendra_backend.expert.dto.ExpertResponse;
import ascendra_backend.expert.service.ExpertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experts")
@RequiredArgsConstructor
public class ExpertController {

    private final ExpertService expertService;


    @PostMapping
    public ResponseEntity<ExpertResponse> createExpert(
            @Valid @RequestBody ExpertRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        expertService.createExpert(
                                request
                        )
                );
    }


    @GetMapping
    public ResponseEntity<List<ExpertResponse>>
    getAllExperts() {

        return ResponseEntity.ok(
                expertService.getAllExperts()
        );
    }


    @GetMapping("/available")
    public ResponseEntity<List<ExpertResponse>>
    getAvailableExperts() {

        return ResponseEntity.ok(
                expertService.getAvailableExperts()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<ExpertResponse>
    getExpertById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                expertService.getExpertById(id)
        );
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<ExpertResponse>
    getExpertByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                expertService.getExpertByUserId(
                        userId
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ExpertResponse>
    updateExpert(
            @PathVariable Long id,
            @Valid @RequestBody ExpertRequest request) {

        return ResponseEntity.ok(
                expertService.updateExpert(
                        id,
                        request
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpert(
            @PathVariable Long id) {

        expertService.deleteExpert(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}