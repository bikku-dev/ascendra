package ascendra_backend.zoom.service;

import ascendra_backend.zoom.config.ZoomConfig;
import ascendra_backend.zoom.dto.ZoomCreateMeetingRequest;
import ascendra_backend.zoom.dto.ZoomMeetingResponse;
import ascendra_backend.zoom.dto.ZoomTokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class ZoomServiceImpl implements ZoomService {

    private final ZoomConfig zoomConfig;

    private final RestClient restClient =
            RestClient.builder().build();


    @Override
    public ZoomMeetingResponse createMeeting(
            String topic,
            LocalDateTime startAt,
            LocalDateTime endAt) {

        // 1. Calculate duration
        long durationMinutes =
                Duration.between(
                        startAt,
                        endAt
                ).toMinutes();

        if (durationMinutes <= 0) {

            throw new RuntimeException(
                    "Meeting duration must be greater than zero"
            );
        }


        // 2. Get Zoom access token
        String accessToken =
                getAccessToken();


        // 3. Build meeting request
        ZoomCreateMeetingRequest request =
                ZoomCreateMeetingRequest.builder()
                        .topic(topic)
                        .type(2)
                        .startTime(startAt.toString())
                        .duration(
                                (int) durationMinutes
                        )
                        .timezone(
                                "Asia/Kolkata"
                        )
                        .settings(
                                ZoomCreateMeetingRequest
                                        .ZoomSettings
                                        .builder()
                                        .waitingRoom(true)
                                        .joinBeforeHost(false)
                                        .hostVideo(true)
                                        .participantVideo(true)
                                        .muteUponEntry(false)
                                        .build()
                        )
                        .build();


        // 4. Call Zoom API
        return restClient.post()
                .uri(
                        "https://api.zoom.us/v2/users/{userId}/meetings",
                        zoomConfig.getUserId()
                )
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + accessToken
                )
                .contentType(
                        MediaType.APPLICATION_JSON
                )
                .body(request)
                .retrieve()
                .body(ZoomMeetingResponse.class);
    }


    private String getAccessToken() {

        String credentials =
                zoomConfig.getClientId()
                        + ":"
                        + zoomConfig.getClientSecret();

        String encodedCredentials =
                Base64.getEncoder()
                        .encodeToString(
                                credentials.getBytes(
                                        StandardCharsets.UTF_8
                                )
                        );


        MultiValueMap<String, String> form =
                new LinkedMultiValueMap<>();

        form.add(
                "grant_type",
                "account_credentials"
        );

        form.add(
                "account_id",
                zoomConfig.getAccountId()
        );


        ZoomTokenResponse response =
                restClient.post()
                        .uri(
                                "https://zoom.us/oauth/token"
                        )
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                "Basic "
                                        + encodedCredentials
                        )
                        .contentType(
                                MediaType.APPLICATION_FORM_URLENCODED
                        )
                        .body(form)
                        .retrieve()
                        .body(
                                ZoomTokenResponse.class
                        );


        if (response == null
                || response.getAccessToken() == null) {

            throw new RuntimeException(
                    "Failed to obtain Zoom access token"
            );
        }


        return response.getAccessToken();
    }
}