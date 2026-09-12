package ascendra_backend.payment.controller;

import ascendra_backend.payment.dto.*;
import ascendra_backend.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;


    /*
     * Existing payment creation
     */
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        paymentService.createPayment(
                                request
                        )
                );
    }


    /*
     * Create Razorpay Order
     */
    @PostMapping("/razorpay/order")
    public ResponseEntity<RazorpayOrderResponse>
    createRazorpayOrder(
            @Valid @RequestBody
            CreateRazorpayOrderRequest request) {

        return ResponseEntity.ok(
                paymentService.createRazorpayOrder(
                        request
                )
        );
    }


    /*
     * Verify Razorpay Payment
     */
    @PostMapping("/razorpay/verify")
    public ResponseEntity<PaymentResponse>
    verifyRazorpayPayment(
            @Valid @RequestBody
            VerifyRazorpayPaymentRequest request) {

        return ResponseEntity.ok(
                paymentService.verifyRazorpayPayment(
                        request
                )
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse>
    getPaymentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(id)
        );
    }


    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse>
    getPaymentByBookingId(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                paymentService.getPaymentByBookingId(
                        bookingId
                )
        );
    }


    @PatchMapping("/{id}/success")
    public ResponseEntity<PaymentResponse>
    markPaymentSuccess(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.markPaymentSuccess(
                        id
                )
        );
    }


    @PatchMapping("/{id}/failed")
    public ResponseEntity<PaymentResponse>
    markPaymentFailed(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.markPaymentFailed(
                        id
                )
        );
    }
}