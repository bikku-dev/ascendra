package ascendra_backend.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;


    public void sendPasswordResetEmail(
            String to,
            String token) throws MessagingException {

        String resetLink =
                frontendUrl
                        + "/reset-password?token="
                        + token;

        MimeMessage message =
                mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(
                        message,
                        true,
                        "UTF-8"
                );

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(
                "Reset your Ascendra password"
        );

        String html = """
                <!DOCTYPE html>
                <html>
                <body style="
                    margin:0;
                    padding:0;
                    background:#f5f8f7;
                    font-family:Arial,sans-serif;
                ">

                <div style="
                    max-width:600px;
                    margin:40px auto;
                    background:#ffffff;
                    border-radius:16px;
                    padding:40px;
                    box-shadow:0 10px 35px rgba(0,0,0,.08);
                ">

                    <div style="
                        width:48px;
                        height:48px;
                        border-radius:12px;
                        background:#18c7bb;
                        color:white;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:25px;
                        font-weight:bold;
                    ">
                        A
                    </div>

                    <h1 style="
                        color:#102422;
                        margin-top:28px;
                    ">
                        Reset your password
                    </h1>

                    <p style="
                        color:#667773;
                        font-size:15px;
                        line-height:1.7;
                    ">
                        We received a request to reset your
                        Ascendra account password.
                    </p>

                    <div style="margin:30px 0;">
                        <a href="%s"
                           style="
                           display:inline-block;
                           background:#18c7bb;
                           color:#ffffff;
                           text-decoration:none;
                           padding:14px 24px;
                           border-radius:10px;
                           font-weight:bold;
                           ">
                            Reset Password
                        </a>
                    </div>

                    <p style="
                        color:#667773;
                        font-size:13px;
                        line-height:1.6;
                    ">
                        This password reset link will expire
                        in 15 minutes.
                    </p>

                    <p style="
                        color:#667773;
                        font-size:13px;
                        line-height:1.6;
                    ">
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <hr style="
                        border:none;
                        border-top:1px solid #e8eeee;
                        margin:30px 0;
                    ">

                    <p style="
                        color:#9aa8a5;
                        font-size:12px;
                    ">
                        © 2026 Ascendra · Learn. Connect. Grow.
                    </p>

                </div>

                </body>
                </html>
                """.formatted(resetLink);

        helper.setText(html, true);

        mailSender.send(message);
    }
}