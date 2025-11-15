import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Create a token - convert userId to string
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Calculate expiry time: 24 hours from now (in milliseconds)
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;

    // Update user with token
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyUserToken: hashedToken,
        verifyUserTokenExpiry: expiryTime,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: expiryTime,
      });
    }

    // Check if required env variables exist
    if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASSWORD) {
      throw new Error("Mailtrap credentials not configured");
    }

    if (!process.env.DOMAIN) {
      throw new Error("DOMAIN environment variable not configured");
    }

    // Create transporter
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transport.verify();
    console.log("SMTP connection verified");

    // Create the verification/reset URL
    const verificationUrl = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;

    const mailOptions = {
      from: "noreply@yourapp.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">
            ${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}
          </h2>
          <p style="color: #666; line-height: 1.6;">
            Click the button below to ${emailType === "VERIFY" ? "verify your email address" : "reset your password"}:
          </p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
          </a>
          
          <p style="color: #666; line-height: 1.6; margin-top: 20px;">
            Or copy and paste this URL into your browser:
          </p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; word-break: break-all;">
            <code style="color: #333; font-size: 14px;">${verificationUrl}</code>
          </div>
          
          <p style="margin-top: 30px; color: #999; font-size: 14px;">
            ⏰ This link will expire in 24 hours.
          </p>
          <p style="color: #999; font-size: 14px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
      // Plain text version for email clients that don't support HTML
      text: `
${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}

Click the link below or copy and paste it into your browser:
${verificationUrl}

This link will expire in 24 hours.

If you didn't request this, please ignore this email.
      `.trim(),
    };

    console.log(`Sending ${emailType} email to ${email}`);
    const emailRes = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", emailRes.messageId);

    return emailRes;
  } catch (error: any) {
    console.error("Email sending error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};