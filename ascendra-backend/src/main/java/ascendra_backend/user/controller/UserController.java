package ascendra_backend.user.controller;

import ascendra_backend.user.dto.ChangePasswordRequest;
import ascendra_backend.user.dto.UpdateProfileRequest;
import ascendra_backend.user.dto.UserSettingsRequest;
import ascendra_backend.user.dto.UserSettingsResponse;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestBody User user) {

        User savedUser = userService.createUser(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedUser);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return ResponseEntity.ok(
                userService.updateUser(id, user)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<User> getProfile(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getProfile(id)
        );
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<User> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(
                userService.updateProfile(id, request)
        );
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(id, request);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/settings")
    public ResponseEntity<UserSettingsResponse> getSettings(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getSettings(id)
        );
    }

    @PutMapping("/{id}/settings")
    public ResponseEntity<UserSettingsResponse> updateSettings(
            @PathVariable Long id,
            @Valid @RequestBody UserSettingsRequest request) {

        return ResponseEntity.ok(
                userService.updateSettings(id, request)
        );
    }
}