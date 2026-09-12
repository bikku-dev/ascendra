package ascendra_backend.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettingsResponse {

    private Long id;

    private Long userId;

    private Boolean emailNotifications;

    private Boolean pushNotifications;

    private Boolean bookingNotifications;

    private Boolean messageNotifications;

    private String timezone;
}