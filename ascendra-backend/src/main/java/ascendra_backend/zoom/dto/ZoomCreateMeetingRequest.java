package ascendra_backend.zoom.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZoomCreateMeetingRequest {

    private String topic;

    private Integer type;

    private String startTime;

    private Integer duration;

    private String timezone;

    private String password;

    private ZoomSettings settings;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ZoomSettings {

        @JsonProperty("waiting_room")
        private Boolean waitingRoom;

        @JsonProperty("join_before_host")
        private Boolean joinBeforeHost;

        @JsonProperty("host_video")
        private Boolean hostVideo;

        @JsonProperty("participant_video")
        private Boolean participantVideo;

        @JsonProperty("mute_upon_entry")
        private Boolean muteUponEntry;
    }
}