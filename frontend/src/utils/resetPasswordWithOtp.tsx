import axios from "axios";
import validator from "validator";
import { toast } from "react-toastify";

interface ResetPasswordWithOtpArgs {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}

async function resetPasswordWithOtp({
  email,
  otp,
  password,
  confirmPassword,
  setErrorMsg,
}: ResetPasswordWithOtpArgs) {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedOtp = otp.trim();

  if (!validator.isEmail(normalizedEmail)) {
    setErrorMsg("Enter a valid email address.");
    return false;
  }

  if (!/^\d{6}$/.test(trimmedOtp)) {
    setErrorMsg("Enter the 6-digit OTP sent to your email.");
    return false;
  }

  if (!validator.isStrongPassword(password)) {
    setErrorMsg(
      "Password must be strong with uppercase, lowercase, number, and special character."
    );
    return false;
  }

  if (password !== confirmPassword) {
    setErrorMsg("Passwords do not match.");
    return false;
  }

  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/forgot-password/reset`,
      {
        email: normalizedEmail,
        otp: trimmedOtp,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (result.data.success) {
      setErrorMsg("");
      toast.success("Password reset successfully. Please sign in.");
      return true;
    }
  } catch (error) {
    console.error(error);
    // @ts-expect-error "need to figure out type"
    const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
    setErrorMsg(errorMessage);
    toast.error(errorMessage);
  }

  return false;
}

export default resetPasswordWithOtp;

