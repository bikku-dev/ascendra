package ascendra_backend.matching.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorMatchResponse {

    private Long expertId;

    private Long userId;

    private String mentorName;

    private String professionalTitle;

    private String bio;

    private Integer experienceYears;

    private BigDecimal hourlyRate;

    private Double rating;

    private Double matchScore;

    private Integer matchedSkills;

    private Integer totalRequiredSkills;

    private Boolean available;
}