
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("api",process.env.RESEND_API_KEY)
// console.log(process.env.RESEND_API_KEY);
console.log(process.env.NEXTAUTH_URL);


export const emailSend = async (email: string, token: string) => {
 const verificationLink =`${process.env.NEXTAUTH_URL}/verify?token=${token}`;
  const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
     html: `
      <h2>Welcome 👋</h2>

      <p>Please verify your email by clicking the button below.</p>

      <a
        href="${verificationLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#ea580c;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Verify Email
      </a>

      <p>This link expires in one hour.</p>
    `,
  });
  console.log("result", result)
};
