package ascendra_backend.booking.service;

import ascendra_backend.booking.dto.BookingRequest;
import ascendra_backend.booking.dto.BookingResponse;
import ascendra_backend.booking.entity.Booking;
import ascendra_backend.booking.entity.BookingStatus;
import ascendra_backend.booking.exception.LearnerProfileRequiredException;
import ascendra_backend.booking.mapper.BookingMapper;
import ascendra_backend.booking.repository.BookingRepository;
import ascendra_backend.expert.entity.DayOfWeek;
import ascendra_backend.expert.entity.ExpertAvailability;
import ascendra_backend.expert.entity.ExpertProfile;
import ascendra_backend.expert.repository.ExpertAvailabilityRepository;
import ascendra_backend.expert.repository.ExpertProfileRepository;
import ascendra_backend.learner.entity.LearnerProfile;
import ascendra_backend.learner.repository.LearnerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final LearnerProfileRepository learnerRepository;
    private final ExpertProfileRepository expertRepository;
    private final ExpertAvailabilityRepository availabilityRepository;
    private final BookingMapper bookingMapper;

    private List<BookingStatus> activeBookingStatuses() {
        return List.of(
                BookingStatus.PENDING_PAYMENT,
                BookingStatus.CONFIRMED
        );
    }

    @Override
    public BookingResponse createBooking(
            BookingRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Booking request is required"
            );
        }

        if (request.getLearnerId() == null) {
            throw new IllegalArgumentException(
                    "Learner ID is required"
            );
        }

        if (request.getExpertId() == null) {
            throw new IllegalArgumentException(
                    "Expert ID is required"
            );
        }

        if (request.getBookingDate() == null) {
            throw new IllegalArgumentException(
                    "Booking date is required"
            );
        }

        if (request.getStartTime() == null) {
            throw new IllegalArgumentException(
                    "Start time is required"
            );
        }

        if (request.getEndTime() == null) {
            throw new IllegalArgumentException(
                    "End time is required"
            );
        }

        if (request.getAmount() == null) {
            throw new IllegalArgumentException(
                    "Amount is required"
            );
        }

        if (request.getBookingDate()
                .isBefore(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Booking date cannot be in the past"
            );
        }

        LocalTime startTime =
                request.getStartTime();

        LocalTime endTime =
                request.getEndTime();

        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException(
                    "Start time must be before end time"
            );
        }

        LearnerProfile learner =
                learnerRepository.findById(
                        request.getLearnerId()
                ).orElse(null);

        if (learner == null) {
            learner =
                    learnerRepository
                            .findByUserId(
                                    request.getLearnerId()
                            )
                            .orElseThrow(() ->
                                    new LearnerProfileRequiredException(
                                            "Please complete your learner profile before booking an expert."
                                    )
                            );
        }

        ExpertProfile expert =
                expertRepository.findById(
                        request.getExpertId()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Expert not found with id: "
                                        + request.getExpertId()
                        )
                );

        if (!Boolean.TRUE.equals(
                expert.getAvailable()
        )) {

            throw new IllegalArgumentException(
                    "Expert is currently unavailable"
            );
        }

        DayOfWeek expertDay =
                DayOfWeek.valueOf(
                        request.getBookingDate()
                                .getDayOfWeek()
                                .name()
                );

        List<ExpertAvailability> availabilitySlots =
                availabilityRepository
                        .findByExpertIdAndActiveTrue(
                                expert.getId()
                        );

        boolean insideExpertAvailability =
                availabilitySlots.stream()
                        .anyMatch(slot ->
                                slot.getDayOfWeek()
                                        == expertDay
                                        && !startTime.isBefore(
                                        slot.getStartTime()
                                )
                                        && !endTime.isAfter(
                                        slot.getEndTime()
                                )
                        );

        if (!insideExpertAvailability) {

            throw new IllegalArgumentException(
                    "Expert is not available at the selected time"
            );
        }

        List<BookingStatus> activeStatuses =
                activeBookingStatuses();

        boolean overlappingBooking =
                bookingRepository.existsOverlappingBooking(
                        expert.getId(),
                        request.getBookingDate(),
                        startTime,
                        endTime,
                        activeStatuses
                );

        if (overlappingBooking) {

            throw new IllegalArgumentException(
                    "This time slot is already booked"
            );
        }

        Booking booking =
                Booking.builder()
                        .learner(learner)
                        .expert(expert)
                        .bookingDate(
                                request.getBookingDate()
                        )
                        .startTime(startTime)
                        .endTime(endTime)
                        .amount(request.getAmount())
                        .status(
                                BookingStatus.PENDING_PAYMENT
                        )
                        .build();

        Booking savedBooking =
                bookingRepository.save(booking);

        return bookingMapper.toResponse(
                savedBooking
        );
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(
            Long id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found with id: "
                                                + id
                                )
                        );

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getLearnerBookings(
            Long learnerId) {

        if (learnerId == null) {
            throw new IllegalArgumentException(
                    "Learner ID is required"
            );
        }

        LearnerProfile learner =
                learnerRepository.findById(
                        learnerId
                ).orElse(null);

        if (learner == null) {
            learner =
                    learnerRepository
                            .findByUserId(learnerId)
                            .orElseThrow(() ->
                                    new LearnerProfileRequiredException(
                                            "Please complete your learner profile before viewing your bookings."
                                    )
                            );
        }

        return bookingRepository
                .findByLearnerId(
                        learner.getId()
                )
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getExpertBookings(
            Long expertId) {

        if (!expertRepository.existsById(expertId)) {
            throw new IllegalArgumentException(
                    "Expert not found with id: "
                            + expertId
            );
        }

        return bookingRepository
                .findByExpertId(expertId)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    public BookingResponse cancelBooking(
            Long id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found with id: "
                                                + id
                                )
                        );

        if (booking.getStatus()
                == BookingStatus.COMPLETED) {

            throw new IllegalArgumentException(
                    "Completed booking cannot be cancelled"
            );
        }

        if (booking.getStatus()
                == BookingStatus.CANCELLED) {

            throw new IllegalArgumentException(
                    "Booking is already cancelled"
            );
        }

        booking.setStatus(
                BookingStatus.CANCELLED
        );

        Booking savedBooking =
                bookingRepository.save(booking);

        return bookingMapper.toResponse(
                savedBooking
        );
    }
}