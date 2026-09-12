package ascendra_backend.chat.controller;

import ascendra_backend.chat.dto.ChatMessageResponse;
import ascendra_backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatHistoryController {

    private final ChatService chatService;

    @GetMapping("/booking/{bookingId}")
    public List<ChatMessageResponse> getMessages(
            @PathVariable Long bookingId) {

        return chatService.getMessagesByBooking(bookingId);
    }
}