import axios from "axios";
import validateUserInput from "./validateUserInput";
import { toast } from "react-toastify";

async function signUpUser(
  usernameRef: React.RefObject<HTMLInputElement>,
  emailRef: React.RefObject<HTMLInputElement>,
  passwordRef: React.RefObject<HTMLInputElement>,
  setInputErrorMsg: React.Dispatch<React.SetStateAction<string>>,
  switchTab: () => void
) {
  const username = usernameRef.current?.value ?? "";
  const email = emailRef.current?.value ?? "";
  const password = passwordRef.current?.value ?? "";

  const errorMsg = validateUserInput(username, email, password);

  if (errorMsg) {
    setInputErrorMsg(errorMsg);
    return;
  }

  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`,
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (result.data.success) {
      switchTab();
    }
  } catch (error) {
    console.error(error);
    // @ts-expect-error "need to figure out type"
    const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
    setInputErrorMsg(errorMessage);
    toast.error(errorMessage);
  }
}

export default signUpUser;
