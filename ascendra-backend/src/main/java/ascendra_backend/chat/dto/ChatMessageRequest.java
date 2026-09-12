package ascendra_backend.chat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {

    private Long bookingId;

    private Long senderId;

    private Long receiverId;

    private String message;
}