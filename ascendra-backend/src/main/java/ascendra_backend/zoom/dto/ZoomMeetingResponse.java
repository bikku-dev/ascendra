package ascendra_backend.zoom.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZoomMeetingResponse {

    private String id;

    private String topic;

    @JsonProperty("start_time")
    private String startTime;

    private Integer duration;

    @JsonProperty("join_url")
    private String joinUrl;

    @JsonProperty("start_url")
    private String startUrl;

    private String password;
}