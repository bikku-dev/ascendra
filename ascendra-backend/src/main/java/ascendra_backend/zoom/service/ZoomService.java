package ascendra_backend.zoom.service;

import ascendra_backend.zoom.dto.ZoomMeetingResponse;

import java.time.LocalDateTime;

public interface ZoomService {

    ZoomMeetingResponse createMeeting(
            String topic,
            LocalDateTime startAt,
            LocalDateTime endAt
    );
}