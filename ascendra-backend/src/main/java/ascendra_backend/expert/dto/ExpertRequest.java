package ascendra_backend.expert.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ExpertRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Professional title is required")
    @Size(max = 150)
    private String professionalTitle;

    @NotBlank(message = "Bio is required")
    @Size(max = 1000)
    private String bio;

    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experienceYears;

    @NotNull(message = "Hourly rate is required")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "Hourly rate cannot be negative"
    )
    private BigDecimal hourlyRate;

    private Boolean available;
}