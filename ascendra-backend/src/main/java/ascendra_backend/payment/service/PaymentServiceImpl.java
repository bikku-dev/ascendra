package ascendra_backend.payment.service;

import ascendra_backend.booking.entity.Booking;
import ascendra_backend.booking.entity.BookingStatus;
import ascendra_backend.booking.repository.BookingRepository;
import ascendra_backend.notification.dto.NotificationRequest;
import ascendra_backend.notification.entity.NotificationType;
import ascendra_backend.notification.service.NotificationService;
import ascendra_backend.payment.dto.CreateRazorpayOrderRequest;
import ascendra_backend.payment.dto.PaymentRequest;
import ascendra_backend.payment.dto.PaymentResponse;
import ascendra_backend.payment.dto.RazorpayOrderResponse;
import ascendra_backend.payment.dto.VerifyRazorpayPaymentRequest;
import ascendra_backend.payment.entity.Payment;
import ascendra_backend.payment.entity.PaymentStatus;
import ascendra_backend.payment.gateway.RazorpayService;
import ascendra_backend.payment.mapper.PaymentMapper;
import ascendra_backend.payment.repository.PaymentRepository;
import ascendra_backend.zoom.dto.ZoomMeetingResponse;
import ascendra_backend.zoom.service.ZoomService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    private final BookingRepository bookingRepository;

    private final PaymentMapper paymentMapper;

    private final RazorpayService razorpayService;

    private final NotificationService notificationService;

    private final ZoomService zoomService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Override
    public PaymentResponse createPayment(
            PaymentRequest request) {

        Booking booking =
                bookingRepository.findById(
                                request.getBookingId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with id: "
                                                + request.getBookingId()
                                )
                        );

        if (paymentRepository.existsByBookingId(
                booking.getId()
        )) {

            throw new RuntimeException(
                    "Payment already exists for this booking"
            );
        }

        if (booking.getStatus()
                != BookingStatus.PENDING_PAYMENT) {

            throw new RuntimeException(
                    "Payment cannot be created for booking with status: "
                            + booking.getStatus()
            );
        }

        Payment payment =
                Payment.builder()
                        .booking(booking)
                        .amount(booking.getAmount())
                        .status(PaymentStatus.CREATED)
                        .build();

        Payment savedPayment =
                paymentRepository.save(payment);

        return paymentMapper.toResponse(
                savedPayment
        );
    }

    @Override
    public RazorpayOrderResponse createRazorpayOrder(
            CreateRazorpayOrderRequest request) {

        Booking booking =
                bookingRepository.findById(
                                request.getBookingId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with id: "
                                                + request.getBookingId()
                                )
                        );

        if (booking.getStatus()
                != BookingStatus.PENDING_PAYMENT) {

            throw new RuntimeException(
                    "Booking is not waiting for payment. Current status: "
                            + booking.getStatus()
            );
        }

        Payment payment =
                paymentRepository.findByBookingId(
                                booking.getId()
                        )
                        .orElseGet(() -> {

                            Payment newPayment =
                                    Payment.builder()
                                            .booking(booking)
                                            .amount(
                                                    booking.getAmount()
                                            )
                                            .status(
                                                    PaymentStatus.CREATED
                                            )
                                            .build();

                            return paymentRepository.save(
                                    newPayment
                            );
                        });

        if (payment.getRazorpayOrderId() != null) {

            return buildOrderResponse(
                    payment
            );
        }

        try {

            long amountInPaise =
                    payment.getAmount()
                            .multiply(
                                    BigDecimal.valueOf(100)
                            )
                            .longValueExact();

            JSONObject razorpayOrder =
                    razorpayService.createOrder(
                            amountInPaise / 100,
                            "BOOKING_" + booking.getId()
                    );

            String razorpayOrderId =
                    razorpayOrder.getString("id");

            payment.setRazorpayOrderId(
                    razorpayOrderId
            );

            paymentRepository.save(payment);

            return buildOrderResponse(
                    payment
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to create Razorpay order: "
                            + e.getMessage(),
                    e
            );
        }
    }

    private RazorpayOrderResponse buildOrderResponse(
            Payment payment) {

        long amountInPaise =
                payment.getAmount()
                        .multiply(
                                BigDecimal.valueOf(100)
                        )
                        .longValueExact();

        return RazorpayOrderResponse.builder()
                .paymentId(
                        payment.getId()
                )
                .bookingId(
                        payment.getBooking().getId()
                )
                .razorpayOrderId(
                        payment.getRazorpayOrderId()
                )
                .razorpayKeyId(
                        razorpayKeyId
                )
                .amount(
                        amountInPaise
                )
                .currency("INR")
                .status(
                        payment.getStatus().name()
                )
                .build();
    }

    @Override
    public PaymentResponse verifyRazorpayPayment(
            VerifyRazorpayPaymentRequest request) {

        Payment payment =
                paymentRepository.findById(
                                request.getPaymentId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with id: "
                                                + request.getPaymentId()
                                )
                        );

        if (payment.getStatus()
                == PaymentStatus.SUCCESS) {

            return paymentMapper.toResponse(
                    payment
            );
        }

        if (!request.getRazorpayOrderId()
                .equals(payment.getRazorpayOrderId())) {

            throw new RuntimeException(
                    "Razorpay order does not match payment"
            );
        }

        boolean valid =
                razorpayService.verifyPaymentSignature(
                        request.getRazorpayOrderId(),
                        request.getRazorpayPaymentId(),
                        request.getRazorpaySignature()
                );

        if (!valid) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            paymentRepository.save(payment);

            createPaymentFailedNotification(
                    payment
            );

            throw new RuntimeException(
                    "Invalid Razorpay payment signature"
            );
        }

        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setRazorpaySignature(
                request.getRazorpaySignature()
        );

        payment.setTransactionId(
                request.getRazorpayPaymentId()
        );

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setPaidAt(
                LocalDateTime.now()
        );

        Booking booking =
                payment.getBooking();

        booking.setStatus(
                BookingStatus.CONFIRMED
        );

        createZoomMeeting(
                booking
        );

        bookingRepository.save(
                booking
        );

        createBookingNotifications(
                booking,
                payment
        );

        return paymentMapper.toResponse(
                paymentRepository.save(payment)
        );
    }

    private void createZoomMeeting(
            Booking booking) {

        if (booking.getZoomMeetingId() != null) {
            return;
        }

        LocalDate bookingDate =
                booking.getBookingDate();

        LocalTime startTime =
                booking.getStartTime();

        LocalTime endTime =
                booking.getEndTime();

        LocalDateTime startAt =
                LocalDateTime.of(
                        bookingDate,
                        startTime
                );

        LocalDateTime endAt =
                LocalDateTime.of(
                        bookingDate,
                        endTime
                );

        String topic =
                "Ascendra Mentoring Session - Booking #"
                        + booking.getId();

        ZoomMeetingResponse meeting =
                zoomService.createMeeting(
                        topic,
                        startAt,
                        endAt
                );

        if (meeting == null
                || meeting.getId() == null
                || meeting.getJoinUrl() == null) {

            throw new RuntimeException(
                    "Failed to create Zoom meeting"
            );
        }

        booking.setZoomMeetingId(
                meeting.getId()
        );

        booking.setZoomJoinUrl(
                meeting.getJoinUrl()
        );

        booking.setZoomStartUrl(
                meeting.getStartUrl()
        );

        booking.setZoomPassword(
                meeting.getPassword()
        );
    }

    private void createBookingNotifications(
            Booking booking,
            Payment payment) {

        Long learnerUserId =
                booking
                        .getLearner()
                        .getUser()
                        .getId();

        Long expertUserId =
                booking
                        .getExpert()
                        .getUser()
                        .getId();

        String expertName =
                booking
                        .getExpert()
                        .getUser()
                        .getName();

        String learnerName =
                booking
                        .getLearner()
                        .getUser()
                        .getName();

        String bookingDate =
                booking.getBookingDate() != null
                        ? booking.getBookingDate().toString()
                        : "Not available";

        String startTime =
                booking.getStartTime() != null
                        ? booking.getStartTime().toString()
                        : "Not available";

        String endTime =
                booking.getEndTime() != null
                        ? booking.getEndTime().toString()
                        : "Not available";

        String amount =
                booking.getAmount() != null
                        ? booking.getAmount().toPlainString()
                        : "0";

        String transactionId =
                payment != null
                        && payment.getTransactionId() != null
                        ? payment.getTransactionId()
                        : payment != null
                        && payment.getRazorpayPaymentId() != null
                        ? payment.getRazorpayPaymentId()
                        : "Not available";

        notificationService.createNotification(
                NotificationRequest.builder()
                        .userId(
                                learnerUserId
                        )
                        .title(
                                "Payment Successful"
                        )
                        .message(
                                "Payment of ₹"
                                        + amount
                                        + " was successful for your mentoring session with "
                                        + expertName
                                        + ". Booking #"
                                        + booking.getId()
                                        + " is confirmed for "
                                        + bookingDate
                                        + " from "
                                        + startTime
                                        + " to "
                                        + endTime
                                        + ". Transaction ID: "
                                        + transactionId
                                        + "."
                        )
                        .type(
                                NotificationType.PAYMENT_SUCCESS
                        )
                        .referenceId(
                                booking.getId()
                        )
                        .build()
        );

        notificationService.createNotification(
                NotificationRequest.builder()
                        .userId(
                                learnerUserId
                        )
                        .title(
                                "Session Confirmed"
                        )
                        .message(
                                "Your mentoring session with "
                                        + expertName
                                        + " is confirmed for "
                                        + bookingDate
                                        + " from "
                                        + startTime
                                        + " to "
                                        + endTime
                                        + ". Your Zoom meeting is ready."
                        )
                        .type(
                                NotificationType.BOOKING_CONFIRMED
                        )
                        .referenceId(
                                booking.getId()
                        )
                        .build()
        );

        notificationService.createNotification(
                NotificationRequest.builder()
                        .userId(
                                expertUserId
                        )
                        .title(
                                "New Session Confirmed"
                        )
                        .message(
                                learnerName
                                        + " has booked a mentoring session with you for "
                                        + bookingDate
                                        + " from "
                                        + startTime
                                        + " to "
                                        + endTime
                                        + ". Your Zoom meeting is ready."
                        )
                        .type(
                                NotificationType.SESSION_CREATED
                        )
                        .referenceId(
                                booking.getId()
                        )
                        .build()
        );
    }

    private void createPaymentFailedNotification(
            Payment payment) {

        Booking booking =
                payment.getBooking();

        if (booking == null
                || booking.getLearner() == null
                || booking.getLearner().getUser() == null) {
            return;
        }

        Long learnerUserId =
                booking
                        .getLearner()
                        .getUser()
                        .getId();

        String expertName =
                booking
                        .getExpert()
                        .getUser()
                        .getName();

        String amount =
                payment.getAmount() != null
                        ? payment.getAmount().toPlainString()
                        : "0";

        notificationService.createNotification(
                NotificationRequest.builder()
                        .userId(
                                learnerUserId
                        )
                        .title(
                                "Payment Failed"
                        )
                        .message(
                                "Your payment of ₹"
                                        + amount
                                        + " for the mentoring session with "
                                        + expertName
                                        + " could not be verified. "
                                        + "Please try again."
                        )
                        .type(
                                NotificationType.PAYMENT_FAILED
                        )
                        .referenceId(
                                booking.getId()
                        )
                        .build()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(
            Long id) {

        Payment payment =
                paymentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with id: "
                                                + id
                                )
                        );

        return paymentMapper.toResponse(
                payment
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBookingId(
            Long bookingId) {

        Payment payment =
                paymentRepository.findByBookingId(
                                bookingId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found for booking id: "
                                                + bookingId
                                )
                        );

        return paymentMapper.toResponse(
                payment
        );
    }

    @Override
    public PaymentResponse markPaymentSuccess(
            Long paymentId) {

        Payment payment =
                paymentRepository.findById(
                                paymentId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with id: "
                                                + paymentId
                                )
                        );

        if (payment.getStatus()
                == PaymentStatus.SUCCESS) {

            return paymentMapper.toResponse(
                    payment
            );
        }

        String transactionId =
                "TXN_" +
                        UUID.randomUUID()
                                .toString()
                                .replace("-", "")
                                .substring(0, 12)
                                .toUpperCase();

        payment.setTransactionId(
                transactionId
        );

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setPaidAt(
                LocalDateTime.now()
        );

        Booking booking =
                payment.getBooking();

        booking.setStatus(
                BookingStatus.CONFIRMED
        );

        createZoomMeeting(
                booking
        );

        bookingRepository.save(
                booking
        );

        createBookingNotifications(
                booking,
                payment
        );

        return paymentMapper.toResponse(
                paymentRepository.save(payment)
        );
    }

    @Override
    public PaymentResponse markPaymentFailed(
            Long paymentId) {

        Payment payment =
                paymentRepository.findById(
                                paymentId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with id: "
                                                + paymentId
                                )
                        );

        payment.setStatus(
                PaymentStatus.FAILED
        );

        Payment savedPayment =
                paymentRepository.save(
                        payment
                );

        createPaymentFailedNotification(
                payment
        );

        return paymentMapper.toResponse(
                savedPayment
        );
    }
}