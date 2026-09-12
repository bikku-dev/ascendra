package ascendra_backend.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private Long userId;

    @Builder.Default
    @Column(nullable = false)
    private Boolean emailNotifications = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean pushNotifications = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean bookingNotifications = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean messageNotifications = true;

    @Column(nullable = false)
    private String timezone;
}