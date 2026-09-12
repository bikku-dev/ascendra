package ascendra_backend.chat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId;

    private Long senderId;

    private Long receiverId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private LocalDateTime sentAt;
}