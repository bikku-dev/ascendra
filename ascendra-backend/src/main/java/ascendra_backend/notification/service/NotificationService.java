package ascendra_backend.notification.service;

import ascendra_backend.notification.dto.NotificationRequest;
import ascendra_backend.notification.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(
            NotificationRequest request
    );

    List<NotificationResponse> getUserNotifications(
            Long userId
    );

    List<NotificationResponse> getUnreadNotifications(
            Long userId
    );

    long getUnreadCount(
            Long userId
    );

    NotificationResponse markAsRead(
            Long notificationId
    );

    void markAllAsRead(
            Long userId
    );
}