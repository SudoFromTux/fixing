import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { emptyContent, setContentState } from "../config/redux/contentSlice";
import { removeUser } from "../config/redux/userSlice";
import { clearAuthSession } from "../utils/authSession";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

interface UseContentOptions {
  requiresAuth?: boolean;
}

const useContent = (path: string, options?: UseContentOptions) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const requiresAuth = options?.requiresAuth ?? false;

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
        const statusCode = error?.response?.status as number | undefined;

        if (requiresAuth && statusCode === 401) {
          clearAuthSession();
          dispatch(removeUser());
          dispatch(emptyContent());
          toast.error("Your session has expired. Please sign in again.");
          navigate("/auth", { replace: true });
          return;
        }

        // @ts-expect-error "need to figure out type"
        const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
        toast.error(errorMessage);
      }
    }

    void getContent();
  }, [dispatch, navigate, path, requiresAuth]);
};

export default useContent;
