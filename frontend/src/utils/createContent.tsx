import axios from "axios";
import { toast } from "react-toastify";
import { addContent } from "../config/redux/contentSlice";
import { AppDispatch } from "../config/redux/store";

async function createContent(
  inputTitle: string,
  inputLink: string,
  contentType: string,
  tagsArr: string[],
  onModalClose: () => void,
  dispatch: AppDispatch
) {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/content`,
      {
        title: inputTitle,
        link: inputLink,
        type: contentType,
        tags: tagsArr,
      },
      {
        withCredentials: true,
      }
    );
    if (result.data.success) {
      dispatch(addContent(result.data.data));
      onModalClose();
      toast.success("content added successfully!", {
        autoClose: 3000, // 3 seconds
      });
    }
  } catch (error) {
    console.error(error);
    // @ts-expect-error "need to figure out type"
    const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
    toast.error(errorMessage);
  }
}

export default createContent;
