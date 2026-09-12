package ascendra_backend.chat.service;

import ascendra_backend.chat.dto.ChatMessageRequest;
import ascendra_backend.chat.dto.ChatMessageResponse;

import java.util.List;

public interface ChatService {

    ChatMessageResponse saveMessage(ChatMessageRequest request);

    List<ChatMessageResponse> getMessagesByBooking(Long bookingId);
}