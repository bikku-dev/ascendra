package ascendra_backend.auth.oauth;

import ascendra_backend.auth.security.JwtService;
import ascendra_backend.user.entity.AuthProvider;
import ascendra_backend.user.entity.Role;
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

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauth2User =
                (OAuth2User) authentication.getPrincipal();

        // Google information
        String email =
                oauth2User.getAttribute("email");

        String name =
                oauth2User.getAttribute("name");

        String providerId =
                oauth2User.getAttribute("sub");

        String picture =
                oauth2User.getAttribute("picture");

        if (email == null || providerId == null) {

            response.sendRedirect(
                    "http://localhost:5173/login?error=google_data_missing"
            );

            return;
        }

        /*
         * GoogleOAuth2Service already creates/updates
         * the user.
         *
         * Yaha dobara blindly create nahi karna.
         */
        User user =
                userRepository.findByEmail(email)
                        .orElse(null);

        /*
         * Safety:
         * Agar kisi reason se service ke baad bhi
         * user nahi mila, to yaha create kar denge.
         */
        if (user == null) {

            user =
                    User.builder()
                            .name(
                                    name != null
                                            ? name
                                            : "Google User"
                            )
                            .email(email)
                            .password(null)
                            .role(Role.LEARNER)
                            .provider(AuthProvider.GOOGLE)
                            .providerId(providerId)
                            .profilePicture(picture)
                            .build();

            user =
                    userRepository.save(user);

        } else {

            /*
             * Existing user ko Google account ke saath
             * sync rakho.
             */
            if (name != null && !name.isBlank()) {
                user.setName(name);
            }

            user.setProvider(AuthProvider.GOOGLE);
            user.setProviderId(providerId);

            if (picture != null && !picture.isBlank()) {
                user.setProfilePicture(picture);
            }

            userRepository.save(user);
        }

        /*
         * JWT generate karo
         */
        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                );

        /*
         * Frontend par token bhejo
         */
        String redirectUrl =
                "http://localhost:5173/oauth-success?token="
                        + token;

        response.sendRedirect(redirectUrl);
    }
}