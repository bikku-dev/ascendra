package ascendra_backend.auth.service;

import ascendra_backend.auth.dto.AuthResponse;
import ascendra_backend.auth.dto.LoginRequest;
import ascendra_backend.auth.dto.RegisterRequest;
import ascendra_backend.auth.security.JwtService;
import ascendra_backend.user.entity.AuthProvider;
import ascendra_backend.user.entity.Role;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.entity.UserSettings;
import ascendra_backend.user.repository.UserRepository;
import ascendra_backend.user.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException(
                    "Email is already registered"
            );
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(Role.LEARNER)
                .provider(AuthProvider.LOCAL)
                .providerId(null)
                .profilePicture(null)
                .build();

        User savedUser = userRepository.save(user);

        UserSettings settings = UserSettings.builder()
                .userId(savedUser.getId())
                .emailNotifications(true)
                .pushNotifications(true)
                .bookingNotifications(true)
                .messageNotifications(true)
                .timezone("Asia/Kolkata")
                .build();

        userSettingsRepository.save(settings);

        String token = jwtService.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        return buildResponse(
                savedUser,
                token
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return buildResponse(
                user,
                token
        );
    }

    private AuthResponse buildResponse(
            User user,
            String token) {

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}