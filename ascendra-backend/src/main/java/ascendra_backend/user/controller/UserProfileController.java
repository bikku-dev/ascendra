package ascendra_backend.user.controller;

import ascendra_backend.auth.security.JwtService;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            HttpServletRequest request) {

        try {

            String token =
                    getToken(request);

            if (token == null) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Authorization token missing"
                                )
                        );
            }

            if (!jwtService.isTokenValid(token)) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid or expired token"
                                )
                        );
            }

            Long userId =
                    jwtService.extractUserId(token);

            User user =
                    userRepository.findById(userId)
                            .orElse(null);

            if (user == null) {

                return ResponseEntity
                        .status(404)
                        .body(
                                Map.of(
                                        "message",
                                        "User not found"
                                )
                        );
            }

            return ResponseEntity.ok(
                    buildProfileResponse(user)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "message",
                                    "Unable to load profile"
                            )
                    );
        }
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<?> uploadProfilePicture(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) {

        try {

            String token =
                    getToken(request);

            if (token == null) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Authorization token missing"
                                )
                        );
            }

            if (!jwtService.isTokenValid(token)) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid or expired token"
                                )
                        );
            }

            if (
                    file == null ||
                            file.isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Please select an image"
                                )
                        );
            }

            String contentType =
                    file.getContentType();

            if (
                    contentType == null ||
                            !contentType.toLowerCase()
                                    .startsWith("image/")
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Only image files are allowed"
                                )
                        );
            }

            long maxSize =
                    5L * 1024L * 1024L;

            if (
                    file.getSize() >
                            maxSize
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Image size must be less than 5 MB"
                                )
                        );
            }

            Long userId =
                    jwtService.extractUserId(token);

            User user =
                    userRepository.findById(userId)
                            .orElse(null);

            if (user == null) {

                return ResponseEntity
                        .status(404)
                        .body(
                                Map.of(
                                        "message",
                                        "User not found"
                                )
                        );
            }

            byte[] imageBytes =
                    file.getBytes();

            String base64 =
                    Base64
                            .getEncoder()
                            .encodeToString(
                                    imageBytes
                            );

            String imageUrl =
                    "data:"
                            + contentType
                            + ";base64,"
                            + base64;

            user.setProfilePicture(
                    imageUrl
            );

            User savedUser =
                    userRepository.save(user);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Profile picture updated successfully",

                            "profilePicture",
                            savedUser.getProfilePicture(),

                            "name",
                            savedUser.getName(),

                            "email",
                            savedUser.getEmail()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to upload profile picture",
                                    "error",
                                    e.getMessage() == null
                                            ? "Unknown error"
                                            : e.getMessage()
                            )
                    );
        }
    }

    @DeleteMapping("/profile/picture")
    public ResponseEntity<?> removeProfilePicture(
            HttpServletRequest request) {

        try {

            String token =
                    getToken(request);

            if (token == null) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Authorization token missing"
                                )
                        );
            }

            if (!jwtService.isTokenValid(token)) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid or expired token"
                                )
                        );
            }

            Long userId =
                    jwtService.extractUserId(token);

            User user =
                    userRepository.findById(userId)
                            .orElse(null);

            if (user == null) {

                return ResponseEntity
                        .status(404)
                        .body(
                                Map.of(
                                        "message",
                                        "User not found"
                                )
                        );
            }

            user.setProfilePicture(null);

            userRepository.save(user);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Profile picture removed successfully",

                            "profilePicture",
                            ""
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to remove profile picture"
                            )
                    );
        }
    }

    private Map<String, Object> buildProfileResponse(
            User user) {

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "id",
                user.getId()
        );

        response.put(
                "name",
                user.getName()
        );

        response.put(
                "email",
                user.getEmail()
        );

        response.put(
                "role",
                user.getRole() == null
                        ? null
                        : user.getRole().name()
        );

        response.put(
                "provider",
                user.getProvider() == null
                        ? null
                        : user.getProvider().name()
        );

        response.put(
                "profilePicture",
                user.getProfilePicture()
        );

        return response;
    }

    private String getToken(
            HttpServletRequest request) {

        String authorization =
                request.getHeader(
                        "Authorization"
                );

        if (
                authorization == null ||
                        !authorization.startsWith(
                                "Bearer "
                        )
        ) {

            return null;
        }

        return authorization.substring(7);
    }
}
