package ascendra_backend.notification.controller;

import ascendra_backend.notification.dto.NotificationRequest;
import ascendra_backend.notification.dto.NotificationResponse;
import ascendra_backend.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;


    @PostMapping
    public ResponseEntity<NotificationResponse>
    createNotification(
            @Valid @RequestBody
            NotificationRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        notificationService
                                .createNotification(
                                        request
                                )
                );
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>>
    getUserNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .getUserNotifications(userId)
        );
    }


    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>>
    getUnreadNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .getUnreadNotifications(userId)
        );
    }


    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Long>
    getUnreadCount(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .getUnreadCount(userId)
        );
    }


    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse>
    markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(id)
        );
    }


    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<Void>
    markAllAsRead(
            @PathVariable Long userId) {

        notificationService
                .markAllAsRead(userId);

        return ResponseEntity.noContent()
                .build();
    }
}