package ascendra_backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettingsRequest {

    @NotNull
    private Boolean emailNotifications;

    @NotNull
    private Boolean pushNotifications;

    @NotNull
    private Boolean bookingNotifications;

    @NotNull
    private Boolean messageNotifications;

    @NotBlank
    private String timezone;
}