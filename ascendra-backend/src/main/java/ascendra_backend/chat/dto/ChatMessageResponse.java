package ascendra_backend.chat.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {

    private Long id;

    private Long bookingId;

    private Long senderId;

    private Long receiverId;

    private String message;

    private LocalDateTime sentAt;
}