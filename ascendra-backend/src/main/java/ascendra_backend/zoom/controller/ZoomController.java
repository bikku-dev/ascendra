package ascendra_backend.zoom.controller;

import ascendra_backend.zoom.dto.ZoomMeetingResponse;
import ascendra_backend.zoom.service.ZoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/zoom")
@RequiredArgsConstructor
public class ZoomController {

    private final ZoomService zoomService;

    @PostMapping("/meetings")
    public ResponseEntity<ZoomMeetingResponse> createMeeting(

            @RequestParam String topic,

            @RequestParam String startAt,

            @RequestParam String endAt
    ) {

        LocalDateTime startDateTime =
                LocalDateTime.parse(startAt);

        LocalDateTime endDateTime =
                LocalDateTime.parse(endAt);

        return ResponseEntity.ok(
                zoomService.createMeeting(
                        topic,
                        startDateTime,
                        endDateTime
                )
        );
    }
}