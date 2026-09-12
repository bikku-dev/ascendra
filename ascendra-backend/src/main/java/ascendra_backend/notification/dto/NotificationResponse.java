package ascendra_backend.notification.dto;

import ascendra_backend.notification.entity.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;

    private Long userId;

    private String title;

    private String message;

    private NotificationType type;

    private Long referenceId;

    private Boolean read;

    private LocalDateTime createdAt;
}