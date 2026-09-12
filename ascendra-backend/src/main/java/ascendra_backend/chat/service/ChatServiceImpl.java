package ascendra_backend.chat.service;

import ascendra_backend.chat.dto.ChatMessageRequest;
import ascendra_backend.chat.dto.ChatMessageResponse;
import ascendra_backend.chat.entity.ChatMessage;
import ascendra_backend.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;

    @Override
    public ChatMessageResponse saveMessage(ChatMessageRequest request) {

        ChatMessage message = ChatMessage.builder()
                .bookingId(request.getBookingId())
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .message(request.getMessage())
                .sentAt(LocalDateTime.now())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessagesByBooking(Long bookingId) {

        return chatMessageRepository
                .findByBookingIdOrderBySentAtAsc(bookingId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ChatMessageResponse toResponse(ChatMessage message) {

        return ChatMessageResponse.builder()
                .id(message.getId())
                .bookingId(message.getBookingId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .message(message.getMessage())
                .sentAt(message.getSentAt())
                .build();
    }
}