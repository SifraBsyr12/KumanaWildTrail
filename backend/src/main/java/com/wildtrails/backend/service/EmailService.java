package com.wildtrails.backend.service;

import com.wildtrails.backend.security.EncryptionUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // === Booking Confirmation Email (Initial) ===
    public void sendBookingEmail(String toEmail, Long bookingId) {
        String encryptedId = EncryptionUtil.encrypt(String.valueOf(bookingId));
        String link = "http://localhost:5173/Booking/" + encryptedId;

        String subject = "Your Safari Booking Confirmation";

        String htmlContent = """
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 20px;">
                        <h2 style="color: #2E8B57;">Kumana Wildtrails - Booking Confirmation</h2>
                        <p>Thank you for booking your safari adventure with <strong>Kumana Wild Trails</strong>!</p>
                        <p>You can view your booking details using the link below:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="%s" 
                               style="display: inline-block; background-color: #2E8B57; color: white; 
                                      padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                                View Booking
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #555;">
                            Please keep this link safe. You’ll need it to view or manage your booking later.
                        </p>
                        <hr/>
                        <p style="font-size: 12px; color: #999;">© 2025 Kumana WildTrails</p>
                    </div>
                </body>
            </html>
            """.formatted(link);

        sendEmail(toEmail, subject, htmlContent);
    }

    // === Booking Accepted → Proceed to Payment Email (FIXED) ===
    public void sendBookingConfirmationEmail(String toEmail, Long bookingId) {
        String encryptedId = EncryptionUtil.encrypt(String.valueOf(bookingId));
        String bookingLink = "http://localhost:5173/Booking/" + encryptedId;
        String paymentLink = "http://localhost:5173/Payment/" + encryptedId;

        String subject = "Your Safari Booking Accepted – Proceed to Payment";

        String htmlContent = """
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 25px;">
                        <h2 style="color: #2E8B57;">Kumana Wildtrails - Booking Accepted</h2>
                        <p>Dear Explorer,</p>
                        <p>Your safari booking has been <strong>accepted</strong>!</p>
                        <p>You can now proceed with your payment to confirm your adventure.</p>

                        <div style="margin: 30px 0; text-align: center;">
                            <a href="%s" 
                               style="display: inline-block; background-color: #2E8B57; color: white; 
                                      padding: 14px 28px; border-radius: 6px; text-decoration: none; 
                                      font-weight: bold; font-size: 16px;">
                                Proceed to Payment
                            </a>
                        </div>

                        <p style="text-align: center;">Or review your booking details first:</p>
                        <div style="margin: 15px 0; text-align: center;">
                            <a href="%s" 
                               style="display: inline-block; background-color: #444; color: white; 
                                      padding: 10px 20px; border-radius: 6px; text-decoration: none; 
                                      font-size: 14px;">
                                View Booking Details
                            </a>
                        </div>

                        <hr/>
                        <p style="font-size: 12px; color: #999;">© 2025 Kumana WildTrails</p>
                    </div>
                </body>
            </html>
            """.formatted(paymentLink, bookingLink);

        sendEmail(toEmail, subject, htmlContent);
    }

    // === Private Helper to Send Email ===
    private void sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_NO, "utf-8");

            helper.setTo(toEmail);
            helper.setFrom(new InternetAddress("wildtrails.booking@gmail.com", "Kumana WildTrails"));
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = isHtml

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to " + toEmail, e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while sending email", e);
        }
    }
}