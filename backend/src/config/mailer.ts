import nodemailer from "nodemailer";

function getMailConfig() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Email service is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD."
    );
  }

  return { user, pass };
}

export async function sendPasswordResetOtpEmail({
  email,
  username,
  otp,
  expiryMinutes,
}: {
  email: string;
  username: string;
  otp: string;
  expiryMinutes: number;
}) {
  const { user, pass } = getMailConfig();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: `"Brainly" <${user}>`,
    to: email,
    subject: "Your Brainly password reset OTP",
    text: `Hi ${username}, your Brainly OTP is ${otp}. It expires in ${expiryMinutes} minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1f2937;">
        <h2 style="margin-bottom: 8px;">Reset your Brainly password</h2>
        <p style="margin-bottom: 16px;">Hi ${username}, use this OTP to reset your password:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 8px; margin: 18px 0; color: #4f46e5;">
          ${otp}
        </div>
        <p style="margin-top: 16px;">This OTP expires in ${expiryMinutes} minutes.</p>
        <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
          If you did not request this, you can ignore this email.
        </p>
      </div>
    `,
  });
}

