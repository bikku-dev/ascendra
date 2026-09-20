package ascendra_backend.auth.exception;

import ascendra_backend.booking.exception.LearnerProfileRequiredException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<Map<String, Object>> handleEmailAlreadyRegistered(
            EmailAlreadyRegisteredException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                        Map.of(
                                "status", 409,
                                "error", "EMAIL_ALREADY_REGISTERED",
                                "message", ex.getMessage()
                        )
                );
    }

    @ExceptionHandler(LearnerProfileRequiredException.class)
    public ResponseEntity<Map<String, Object>> handleLearnerProfileRequired(
            LearnerProfileRequiredException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                        Map.of(
                                "status", 409,
                                "error", "LEARNER_PROFILE_REQUIRED",
                                "message", ex.getMessage()
                        )
                );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        Map.of(
                                "status", 400,
                                "error", "BAD_REQUEST",
                                "message", ex.getMessage()
                        )
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                        Map.of(
                                "status", 500,
                                "error", "INTERNAL_SERVER_ERROR",
                                "message", "Something went wrong. Please try again."
                        )
                );
    }
}