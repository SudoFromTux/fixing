import axios from "axios";
import { toast } from "react-toastify";
import { removeContent } from "../config/redux/contentSlice";
import { AppDispatch } from "../config/redux/store";

async function deleteContentOne(
  _id: string,
  closeModal: () => void,
  dispatch: AppDispatch
) {
  try {
    const result = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/content/${_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (result.data.success) {
      dispatch(removeContent(_id));
      toast.error("content deleted successfully!");
      closeModal();
    }
  } catch (error) {
    console.error(error);
    // @ts-expect-error "need to figure out type"
    const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
    toast.error(errorMessage);
  }
}

export default deleteContentOne;
