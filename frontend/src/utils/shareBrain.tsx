import axios from "axios";
import { Location } from "react-router-dom";
import { toast } from "react-toastify";
import { copyTextToClipboard } from "./clipboard";

interface shareBrainProps {
  share: boolean;
  closeModal: () => void;
  location?: Location;
}

async function shareBrain({ share, closeModal, location }: shareBrainProps) {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/brain/share`,
      {
        share,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (share) {
      toast.success("Brain shared successfully!");

      const Url = window.location.href;
      if (!location?.pathname) {
        return;
      }
      const { pathname } = location;
      const hash = result.data.data.hash;

      const publicUrl = Url.replace(pathname, "/brain/");

      await copyTextToClipboard(publicUrl + hash);

      toast.info("Copied to clipboard");
    } else {
      toast.error("Shared URL deleted successfully!");
    }

    closeModal();
  } catch (error) {
    console.error(error);
    // @ts-expect-error "need to figure out type"
    const errorMessage = error?.response?.data?.message || (error as Error).message || "Network error. Please try again.";
    toast.error(errorMessage);
  }
}

export default shareBrain;
