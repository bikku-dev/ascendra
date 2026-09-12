package ascendra_backend.payment.gateway;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {

    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override
    public JSONObject createOrder(
            Long amount,
            String receipt
    ) throws Exception {

        JSONObject orderRequest = new JSONObject();


        orderRequest.put(
                "amount",
                amount * 100
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                receipt
        );

        orderRequest.put(
                "payment_capture",
                1
        );

        Order order =
                razorpayClient.orders.create(
                        orderRequest
                );

        return order.toJson();
    }

    @Override
    public boolean verifyPaymentSignature(
            String orderId,
            String paymentId,
            String signature
    ) {

        try {

            String payload =
                    orderId + "|" + paymentId;

            return Utils.verifySignature(
                    payload,
                    signature,
                    keySecret
            );

        } catch (Exception e) {

            return false;
        }
    }
}