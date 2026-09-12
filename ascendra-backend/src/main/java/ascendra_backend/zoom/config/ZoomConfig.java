package ascendra_backend.zoom.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class ZoomConfig {

    @Value("${zoom.account-id}")
    private String accountId;

    @Value("${zoom.client-id}")
    private String clientId;

    @Value("${zoom.client-secret}")
    private String clientSecret;

    @Value("${zoom.user-id:me}")
    private String userId;
}