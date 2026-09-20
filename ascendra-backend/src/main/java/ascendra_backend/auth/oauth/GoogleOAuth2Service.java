package ascendra_backend.auth.oauth;

import ascendra_backend.user.entity.AuthProvider;
import ascendra_backend.user.entity.Role;
import ascendra_backend.user.entity.User;
import ascendra_backend.user.entity.UserSettings;
import ascendra_backend.user.repository.UserRepository;
import ascendra_backend.user.repository.UserSettingsRepository;

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
    private final UserSettingsRepository userSettingsRepository;

    private final DefaultOAuth2UserService delegate =
            new DefaultOAuth2UserService();

    @Override
    @Transactional
    public OAuth2User loadUser(
            OAuth2UserRequest userRequest) {

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

        Boolean emailVerified =
                googleUser.getAttribute("email_verified");

        if (email == null
                || email.isBlank()
                || providerId == null
                || providerId.isBlank()) {

            throw new RuntimeException(
                    "Google account information is incomplete"
            );
        }

        if (emailVerified != null
                && !emailVerified) {

            throw new RuntimeException(
                    "Google email is not verified"
            );
        }

        String cleanEmail =
                email.trim().toLowerCase();

        User user =
                userRepository.findByEmail(cleanEmail)
                        .orElse(null);

        if (user == null) {

            user = User.builder()
                    .name(
                            name != null && !name.isBlank()
                                    ? name
                                    : "Google User"
                    )
                    .email(cleanEmail)
                    .password(null)
                    .role(Role.LEARNER)
                    .provider(AuthProvider.GOOGLE)
                    .providerId(providerId)
                    .profilePicture(picture)
                    .build();

            user =
                    userRepository.save(user);

            UserSettings settings =
                    UserSettings.builder()
                            .userId(user.getId())
                            .emailNotifications(true)
                            .pushNotifications(true)
                            .bookingNotifications(true)
                            .messageNotifications(true)
                            .timezone("Asia/Kolkata")
                            .build();

            userSettingsRepository.save(settings);

        } else {

            if (name != null && !name.isBlank()) {
                user.setName(name);
            }

            if (picture != null && !picture.isBlank()) {
                user.setProfilePicture(picture);
            }

            if (user.getProvider() == null) {
                user.setProvider(AuthProvider.GOOGLE);
            }

            if (user.getProviderId() == null
                    || user.getProviderId().isBlank()) {
                user.setProviderId(providerId);
            }

            userRepository.save(user);
        }

        return googleUser;
    }
}