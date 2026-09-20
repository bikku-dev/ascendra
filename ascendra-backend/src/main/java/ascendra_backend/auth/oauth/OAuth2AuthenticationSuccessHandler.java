package ascendra_backend.auth.oauth;

import ascendra_backend.auth.security.JwtService;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    private static final String FRONTEND_URL =
            "https://ascendra-bikku.duckdns.org";

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauth2User =
                (OAuth2User) authentication.getPrincipal();

        String email =
                oauth2User.getAttribute("email");

        if (email == null || email.isBlank()) {
            response.sendRedirect(
                    FRONTEND_URL
                            + "/login?error=google_email_missing"
            );
            return;
        }

        String cleanEmail =
                email.trim().toLowerCase();

        User user =
                userRepository.findByEmail(cleanEmail)
                        .orElse(null);

        if (user == null) {
            response.sendRedirect(
                    FRONTEND_URL
                            + "/login?error=google_account_error"
            );
            return;
        }

        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                );

        String encodedToken =
                URLEncoder.encode(
                        token,
                        StandardCharsets.UTF_8
                );

        response.sendRedirect(
                FRONTEND_URL
                        + "/oauth-success?token="
                        + encodedToken
        );
    }
}