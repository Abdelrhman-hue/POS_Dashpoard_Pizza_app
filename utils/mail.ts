import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailSend = async (email: string, token: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verificationLink = `${baseUrl}/verify?token=${token}`;

  // Log link directly in terminal for instant local testing
  console.log("\n=======================================================");
  console.log("📧 [EMAIL VERIFICATION LINK]:");
  console.log(`To: ${email}`);
  console.log(`Link: ${verificationLink}`);
  console.log("=======================================================\n");

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email | Pizza Dashboard",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 16px; background-color: #fff7ed;">
          <h2 style="color: #ea580c; margin-top: 0;">Welcome to Pizza Dashboard 👋🍕</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            Please verify your email address to activate your account and start ordering delicious hot pizza!
          </p>
          <div style="margin: 25px 0;">
            <a
              href="${verificationLink}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #ea580c;
                color: #ffffff;
                text-decoration: none;
                font-weight: bold;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.3);
              "
            >
              Verify My Email
            </a>
          </div>
          <p style="color: #64748b; font-size: 13px;">This link will expire in 1 hour.</p>
          <p style="color: #94a3b8; font-size: 11px; word-break: break-all;">
            If the button doesn't work, copy and paste this URL into your browser:<br/>
            ${verificationLink}
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.warn(
        "⚠️ [Resend Dev Notice]: In the free testing mode (onboarding@resend.dev), emails can only be delivered to your registered Resend email (abdelrahmanattia4151@gmail.com)."
      );
      console.warn(`Resend Error: ${result.error.message}`);
    }

    return { success: !result.error, result, link: verificationLink };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return { success: false, error, link: verificationLink };
  }
};

export const forgetPasswordSendEmail = async (email: string, token: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  // Log link directly in terminal for instant local testing
  console.log("\n=======================================================");
  console.log("🔑 [PASSWORD RESET LINK]:");
  console.log(`To: ${email}`);
  console.log(`Link: ${resetLink}`);
  console.log("=======================================================\n");

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password | Pizza Dashboard",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 16px; background-color: #fff7ed;">
          <h2 style="color: #ea580c; margin-top: 0;">Reset Your Password 🔒</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to choose a new secure password.
          </p>
          <div style="margin: 25px 0;">
            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #ea580c;
                color: #ffffff;
                text-decoration: none;
                font-weight: bold;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.3);
              "
            >
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 13px;">This link will expire in 1 hour.</p>
          <p style="color: #94a3b8; font-size: 11px; word-break: break-all;">
            If the button doesn't work, copy and paste this URL into your browser:<br/>
            ${resetLink}
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.warn(
        "⚠️ [Resend Dev Notice]: In the free testing mode (onboarding@resend.dev), emails can only be delivered to your registered Resend email (abdelrahmanattia4151@gmail.com)."
      );
      console.warn(`Resend Error: ${result.error.message}`);
    }

    return { success: !result.error, result, link: resetLink };
  } catch (error) {
    console.error("Failed to send reset email via Resend:", error);
    return { success: false, error, link: resetLink };
  }
};
