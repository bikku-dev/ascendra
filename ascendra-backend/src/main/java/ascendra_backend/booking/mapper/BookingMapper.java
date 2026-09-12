package ascendra_backend.booking.mapper;

import ascendra_backend.booking.dto.BookingResponse;
import ascendra_backend.booking.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

        public BookingResponse toResponse(
                Booking booking) {

                return BookingResponse.builder()
                        .id(booking.getId())

                        .learnerId(
                                booking.getLearner().getId()
                        )

                        .learnerName(
                                booking.getLearner()
                                        .getUser()
                                        .getName()
                        )

                        .expertId(
                                booking.getExpert().getId()
                        )

                        .expertName(
                                booking.getExpert()
                                        .getUser()
                                        .getName()
                        )

                        .professionalTitle(
                                booking.getExpert()
                                        .getProfessionalTitle()
                        )

                        .bookingDate(
                                booking.getBookingDate()
                        )

                        .startTime(
                                booking.getStartTime()
                        )

                        .endTime(
                                booking.getEndTime()
                        )

                        .amount(
                                booking.getAmount()
                        )

                        .status(
                                booking.getStatus()
                        )

                        .zoomMeetingId(
                                booking.getZoomMeetingId()
                        )

                        .zoomJoinUrl(
                                booking.getZoomJoinUrl()
                        )

                        .zoomStartUrl(
                                booking.getZoomStartUrl()
                        )

                        .zoomPassword(
                                booking.getZoomPassword()
                        )

                        .build();
        }
}