package ascendra_backend.expert.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertResponse {

    private Long id;

    private Long userId;

    private String userName;

    private String email;

    private String professionalTitle;

    private String bio;

    private Integer experienceYears;

    private BigDecimal hourlyRate;

    private Double rating;

    private Boolean available;
}