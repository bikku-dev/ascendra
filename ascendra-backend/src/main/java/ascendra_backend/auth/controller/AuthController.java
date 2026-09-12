package ascendra_backend.auth.controller;

import ascendra_backend.auth.dto.AuthResponse;
import ascendra_backend.auth.dto.LoginRequest;
import ascendra_backend.auth.dto.RegisterRequest;
import ascendra_backend.auth.security.JwtService;
import ascendra_backend.auth.service.AuthService;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.repository.UserRepository;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final UserRepository userRepository;

    private final JwtService jwtService;


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        authService.register(request)
                );
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }


    // =========================
    // CURRENT USER
    // =========================

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(
            @RequestHeader("Authorization") String authorization) {

        // Authorization:
        // Bearer eyJhbGciOi...

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        String token =
                authorization.substring(7);

        // JWT validate
        if (!jwtService.isTokenValid(token)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        // JWT se user ID nikalo
        Long userId =
                jwtService.extractUserId(token);

        // DB se user nikalo
        User user =
                userRepository.findById(userId)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        return ResponseEntity.ok(user);
    }
}