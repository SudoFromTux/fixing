import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import { removeUser } from "../config/redux/userSlice";
import { AppDispatch } from "../config/redux/store";
import { emptyContent } from "../config/redux/contentSlice";

async function logout(navigate: NavigateFunction, dispatch: AppDispatch) {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    if (result.data.success) {
      toast.info("Logged out successfully");
      dispatch(removeUser());
      dispatch(emptyContent());
      localStorage.removeItem("isLoggedIn");
      navigate("/auth");
    }
  } catch (error) {
    console.error(error);
    // @ts-expect-error "need to figure out type"
    const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
    toast.error(errorMessage);
  }
}

export default logout;
