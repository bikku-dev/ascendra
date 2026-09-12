package ascendra_backend.booking.controller;

import ascendra_backend.booking.dto.BookingRequest;
import ascendra_backend.booking.dto.BookingResponse;
import ascendra_backend.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        bookingService.createBooking(request)
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id)
        );
    }

    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<BookingResponse>>
    getLearnerBookings(
            @PathVariable Long learnerId
    ) {

        return ResponseEntity.ok(
                bookingService.getLearnerBookings(
                        learnerId
                )
        );
    }

    @GetMapping("/expert/{expertId}")
    public ResponseEntity<List<BookingResponse>>
    getExpertBookings(
            @PathVariable Long expertId
    ) {

        return ResponseEntity.ok(
                bookingService.getExpertBookings(
                        expertId
                )
        );
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(id)
        );
    }
}