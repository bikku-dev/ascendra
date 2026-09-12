package ascendra_backend.auth.oauth;

import ascendra_backend.user.entity.AuthProvider;
import ascendra_backend.user.entity.Role;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GoogleOAuth2Service
        implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    private final DefaultOAuth2UserService delegate =
            new DefaultOAuth2UserService();

    @Override
    @Transactional
    public OAuth2User loadUser(
            OAuth2UserRequest userRequest) {

        // Google se user information lao
        OAuth2User googleUser =
                delegate.loadUser(userRequest);

        String email =
                googleUser.getAttribute("email");

        String name =
                googleUser.getAttribute("name");

        String providerId =
                googleUser.getAttribute("sub");

        String picture =
                googleUser.getAttribute("picture");

        // Required information check
        if (email == null || providerId == null) {

            throw new RuntimeException(
                    "Google account information is incomplete"
            );
        }

        // Existing user
        User user =
                userRepository.findByEmail(email)
                        .orElseGet(() -> {

                            // New Google user
                            User newUser =
                                    User.builder()
                                            .name(
                                                    name != null
                                                            ? name
                                                            : "Google User"
                                            )
                                            .email(email)
                                            .password(null)
                                            .role(Role.LEARNER)
                                            .provider(
                                                    AuthProvider.GOOGLE
                                            )
                                            .providerId(providerId)
                                            .profilePicture(picture)
                                            .build();

                            return userRepository.save(newUser);
                        });

        return googleUser;
    }
}