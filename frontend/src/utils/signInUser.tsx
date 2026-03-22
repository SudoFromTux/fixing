import axios from "axios";
import { toast } from "react-toastify";
import { addUser } from "../config/redux/userSlice";
import { AppDispatch } from "../config/redux/store";
import { NavigateFunction } from "react-router-dom";
import { saveAuthSession } from "./authSession";

async function signInUser(
  usernameRef: React.RefObject<HTMLInputElement>,
  passwordRef: React.RefObject<HTMLInputElement>,
  setInputErrorMsg: React.Dispatch<React.SetStateAction<string>>,
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  const usernameOrEmail = usernameRef.current?.value ?? "";
  const password = passwordRef.current?.value ?? "";

  if (!usernameOrEmail.trim()) {
    setInputErrorMsg("username or email is required.");
    return;
  }

  if (!password.trim()) {
    setInputErrorMsg("password is required.");
    return;
  }

  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signin`,
      {
        username: usernameOrEmail,
        email: usernameOrEmail,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (result.data.success) {
      dispatch(addUser(result.data.data));
      saveAuthSession(result.data.data.token, result.data.data.email);
      navigate("/dashboard");
    }
  } catch (error) {
    console.error(error);
    // @ts-expect-error "need to figure out type"
    const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
    setInputErrorMsg(errorMessage);
    toast.error(errorMessage);
  }
}

export default signInUser;
