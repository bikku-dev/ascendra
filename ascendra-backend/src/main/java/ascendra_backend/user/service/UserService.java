package ascendra_backend.user.service;

import ascendra_backend.user.dto.ChangePasswordRequest;
import ascendra_backend.user.dto.UpdateProfileRequest;
import ascendra_backend.user.dto.UserSettingsRequest;
import ascendra_backend.user.dto.UserSettingsResponse;
import ascendra_backend.user.entity.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    User getProfile(Long id);

    User updateProfile(
            Long id,
            UpdateProfileRequest request
    );

    void changePassword(
            Long id,
            ChangePasswordRequest request
    );

    UserSettingsResponse getSettings(Long id);

    UserSettingsResponse updateSettings(
            Long id,
            UserSettingsRequest request
    );
}