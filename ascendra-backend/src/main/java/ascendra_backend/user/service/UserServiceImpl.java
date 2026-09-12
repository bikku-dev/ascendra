package ascendra_backend.user.service;

import ascendra_backend.user.dto.ChangePasswordRequest;
import ascendra_backend.user.dto.UpdateProfileRequest;
import ascendra_backend.user.dto.UserSettingsRequest;
import ascendra_backend.user.dto.UserSettingsResponse;
import ascendra_backend.user.entity.AuthProvider;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.entity.UserSettings;
import ascendra_backend.user.repository.UserRepository;
import ascendra_backend.user.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;

    @Override
    public User createUser(User user) {

        if (user.getProvider() == null) {
            user.setProvider(AuthProvider.LOCAL);
        }

        User savedUser = userRepository.save(user);

        UserSettings settings =
                UserSettings.builder()
                        .userId(savedUser.getId())
                        .emailNotifications(true)
                        .pushNotifications(true)
                        .bookingNotifications(true)
                        .messageNotifications(true)
                        .timezone("Asia/Kolkata")
                        .build();

        userSettingsRepository.save(settings);

        return savedUser;
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        ));
    }

    @Override
    public User updateUser(Long id, User user) {

        User existingUser =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: " + id
                                ));

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found with id: " + id
            );
        }

        userSettingsRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public User getProfile(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        ));
    }

    @Override
    public User updateProfile(
            Long id,
            UpdateProfileRequest request) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: " + id
                                ));

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        return userRepository.save(user);
    }

    @Override
    public void changePassword(
            Long id,
            ChangePasswordRequest request) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: " + id
                                ));

        if (!user.getPassword()
                .equals(request.getCurrentPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException(
                    "New password and confirm password do not match"
            );
        }

        user.setPassword(
                request.getNewPassword()
        );

        userRepository.save(user);
    }

    @Override
    public UserSettingsResponse getSettings(
            Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found with id: " + id
            );
        }

        UserSettings settings =
                userSettingsRepository
                        .findByUserId(id)
                        .orElseGet(() ->
                                createDefaultSettings(id)
                        );

        return toSettingsResponse(settings);
    }

    @Override
    public UserSettingsResponse updateSettings(
            Long id,
            UserSettingsRequest request) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found with id: " + id
            );
        }

        UserSettings settings =
                userSettingsRepository
                        .findByUserId(id)
                        .orElseGet(() ->
                                createDefaultSettings(id)
                        );

        settings.setEmailNotifications(
                request.getEmailNotifications()
        );

        settings.setPushNotifications(
                request.getPushNotifications()
        );

        settings.setBookingNotifications(
                request.getBookingNotifications()
        );

        settings.setMessageNotifications(
                request.getMessageNotifications()
        );

        settings.setTimezone(
                request.getTimezone()
        );

        return toSettingsResponse(
                userSettingsRepository.save(settings)
        );
    }

    private UserSettings createDefaultSettings(
            Long userId) {

        return userSettingsRepository.save(
                UserSettings.builder()
                        .userId(userId)
                        .emailNotifications(true)
                        .pushNotifications(true)
                        .bookingNotifications(true)
                        .messageNotifications(true)
                        .timezone("Asia/Kolkata")
                        .build()
        );
    }

    private UserSettingsResponse toSettingsResponse(
            UserSettings settings) {

        return UserSettingsResponse.builder()
                .id(settings.getId())
                .userId(settings.getUserId())
                .emailNotifications(
                        settings.getEmailNotifications()
                )
                .pushNotifications(
                        settings.getPushNotifications()
                )
                .bookingNotifications(
                        settings.getBookingNotifications()
                )
                .messageNotifications(
                        settings.getMessageNotifications()
                )
                .timezone(
                        settings.getTimezone()
                )
                .build();
    }
}