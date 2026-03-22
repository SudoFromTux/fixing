import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setContentState } from "../config/redux/contentSlice";
axios.defaults.withCredentials = true;

const useContent = (path: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getContent() {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1${path}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (result.data.success) {
          dispatch(setContentState(result.data.data));

          if (result.data.data.length === 0) {
            toast.warning("Add at least one content!");
            return;
          }

          toast.success("Content fetched successfully");
        }
      } catch (error) {
        console.error(error);
        // @ts-expect-error "need to figure out type"
        const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
        toast.error(errorMessage);
      }
    }

    void getContent();
  }, [dispatch, path]);
};

export default useContent;
