package ascendra_backend.chat.controller;

import ascendra_backend.chat.dto.ChatMessageRequest;
import ascendra_backend.chat.dto.ChatMessageResponse;
import ascendra_backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(ChatMessageRequest request) {

        // 1. Database me message save
        ChatMessageResponse response =
                chatService.saveMessage(request);

        // 2. Sirf receiver ke private topic par message bhejo
        String destination =
                "/topic/chat/" + request.getReceiverId();

        messagingTemplate.convertAndSend(
                destination,
                response
        );
    }
}