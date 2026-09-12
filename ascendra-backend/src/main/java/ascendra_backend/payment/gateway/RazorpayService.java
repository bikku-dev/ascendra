package ascendra_backend.payment.gateway;

import org.json.JSONObject;

public interface RazorpayService {

    JSONObject createOrder(
            Long amount,
            String receipt
    ) throws Exception;

    boolean verifyPaymentSignature(
            String orderId,
            String paymentId,
            String signature
    );
}