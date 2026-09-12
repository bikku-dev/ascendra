package ascendra_backend.auth.dto;

import ascendra_backend.user.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String accessToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long userId;

    private String name;

    private String email;

    private Role role;
}