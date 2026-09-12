package ascendra_backend.booking.service;

import ascendra_backend.booking.dto.BookingRequest;
import ascendra_backend.booking.dto.BookingResponse;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponse createBooking(
            BookingRequest request
    );

    BookingResponse getBookingById(
            Long id
    );

    List<BookingResponse> getLearnerBookings(
            Long learnerId
    );

    List<BookingResponse> getExpertBookings(
            Long expertId
    );

    BookingResponse cancelBooking(
            Long id
    );
}