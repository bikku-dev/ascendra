package ascendra_backend.matching.controller;

import ascendra_backend.matching.dto.MentorMatchResponse;
import ascendra_backend.matching.service.MentorMatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MentorMatchingController {

    private final MentorMatchingService matchingService;


    @GetMapping("/goal/{goalId}/mentors")
    public ResponseEntity<List<MentorMatchResponse>>
    findMentors(
            @PathVariable Long goalId) {

        return ResponseEntity.ok(
                matchingService.findMentorsForGoal(
                        goalId
                )
        );
    }
}