package ascendra_backend.notification.service;

import ascendra_backend.notification.dto.NotificationRequest;
import ascendra_backend.notification.dto.NotificationResponse;
import ascendra_backend.notification.entity.Notification;
import ascendra_backend.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;


    @Override
    public NotificationResponse createNotification(
            NotificationRequest request) {

        Notification notification =
                Notification.builder()
                        .userId(request.getUserId())
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .type(request.getType())
                        .referenceId(
                                request.getReferenceId()
                        )
                        .read(false)
                        .build();

        Notification saved =
                notificationRepository.save(
                        notification
                );

        return toResponse(saved);
    }


    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse>
    getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse>
    getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                        userId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {

        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }


    @Override
    public NotificationResponse markAsRead(
            Long notificationId) {

        Notification notification =
                notificationRepository.findById(
                        notificationId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Notification not found with id: "
                                        + notificationId
                        )
                );

        notification.setRead(true);

        return toResponse(
                notificationRepository.save(
                        notification
                )
        );
    }


    @Override
    public void markAllAsRead(Long userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                                userId
                        );

        notifications.forEach(
                notification ->
                        notification.setRead(true)
        );

        notificationRepository.saveAll(
                notifications
        );
    }


    private NotificationResponse toResponse(
            Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .referenceId(
                        notification.getReferenceId()
                )
                .read(notification.getRead())
                .createdAt(
                        notification.getCreatedAt()
                )
                .build();
    }
}