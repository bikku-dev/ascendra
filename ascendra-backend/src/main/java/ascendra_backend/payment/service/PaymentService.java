package ascendra_backend.payment.service;

import ascendra_backend.payment.dto.CreateRazorpayOrderRequest;
import ascendra_backend.payment.dto.PaymentRequest;
import ascendra_backend.payment.dto.PaymentResponse;
import ascendra_backend.payment.dto.RazorpayOrderResponse;
import ascendra_backend.payment.dto.VerifyRazorpayPaymentRequest;

public interface PaymentService {

    PaymentResponse createPayment(
            PaymentRequest request
    );

    PaymentResponse getPaymentById(
            Long id
    );

    PaymentResponse getPaymentByBookingId(
            Long bookingId
    );

    PaymentResponse markPaymentSuccess(
            Long paymentId
    );

    PaymentResponse markPaymentFailed(
            Long paymentId
    );

    RazorpayOrderResponse createRazorpayOrder(
            CreateRazorpayOrderRequest request
    );

    PaymentResponse verifyRazorpayPayment(
            VerifyRazorpayPaymentRequest request
    );
}