import axios from "axios";
import validator from "validator";
import { toast } from "react-toastify";

async function requestPasswordResetOtp(
  email: string,
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>
) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!validator.isEmail(normalizedEmail)) {
    setErrorMsg("Enter a valid email address.");
    return false;
  }

  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/forgot-password/send-otp`,
      {
        email: normalizedEmail,
      },
      {
        withCredentials: true,
      }
    );

    if (result.data.success) {
      setErrorMsg("");
      toast.success("OTP sent to your Gmail.");
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

export default requestPasswordResetOtp;

