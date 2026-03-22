import { CSSProperties, useState } from "react";
import Share from "../Icons/Share";
import Delete from "../Icons/Delete";
import YouTube from "../Icons/YouTube";
import Twitter from "../Icons/Twitter";
import Document from "../Icons/Document";
import axios from "axios";
import { formatDistance } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Edit from "../Icons/Edit";
import EditContentModal from "./EditContentModal";
import PopUpModal from "./PopUpModal";
import { deleteModalText, deleteModalTitle } from "../../config/config";
import validator from "validator";
import { copyTextToClipboard } from "../../utils/clipboard";

axios.defaults.withCredentials = true;

interface cardProps {
  title: string;
  link: string;
  type: string;
  tags?: string[];
  createdAt: string;
  _id: string;
  isSharedBrain?: boolean;
  animationDelayMs?: number;
}

async function shareUrl(title: string, link: string) {
  try {
    if (typeof navigator.share === "function") {
      await navigator.share({
        text: title,
        url: link,
      });
      return;
    }

    await copyTextToClipboard(link);
    toast.info("Link copied to clipboard");
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    toast.error((error as Error).message || "Error sharing content");
    console.error(error);
  }
}

function createYoutubeUrl(link: string) {
  const videoIdMatch = link.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  if (videoIdMatch) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return null; // Return null if no valid ID is found
}

export const Card = ({
  title,
  type,
  link,
  tags,
  createdAt,
  _id,
  isSharedBrain,
  animationDelayMs = 0,
}: cardProps) => {
  const icon: {
    [key: string]: JSX.Element;
    YouTube: JSX.Element;
    "Twitter/X": JSX.Element;
    Document: JSX.Element;
  } = {
    YouTube: <YouTube />,
    "Twitter/X": <Twitter />,
    Document: <Document />,
  };

  const key = type;
  const iconToRender = icon[key];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function convertDate(dateStr: string) {
    const str = formatDistance(new Date(dateStr), new Date());
    return str;
  }

  const dateCreated = convertDate(createdAt);

  const isUrl = validator.isURL(link);

  const youtubeUrl = createYoutubeUrl(link);

  return (
    <div
      className="group hover-lift-card motion-fade-up rounded-[1.5rem] border border-border-soft bg-bg-surface p-8 shadow-md"
      style={{ "--motion-delay": `${animationDelayMs}ms` } as CSSProperties}
    >
      <EditContentModal
        isEditModalOpen={isEditModalOpen}
        closeEditModal={closeEditModal}
        title={title}
        link={link}
        type={type}
        tags={tags}
        contentId={_id}
      />

      {isDeleteModalOpen && (
        <PopUpModal
          isDeleteModal={isDeleteModalOpen}
          closeModal={closeDeleteModal}
          text={deleteModalText}
          title={deleteModalTitle}
          contentId={_id}
        />
      )}

      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center justify-center gap-2 text-text-secondary">
          <div className="min-w-fit rounded-full bg-bg-tag p-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-bg-primaryBtn">
            <a href={link}>{iconToRender}</a>
          </div>
        </div>
        <div className="flex min-w-fit items-center gap-2 text-text-secondary">
          {!isSharedBrain && (
            <div
              className="cursor-pointer rounded-full p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-bg-tag hover:text-bg-primaryBtn"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit />
            </div>
          )}
          {!isSharedBrain && (
            <div
              className="cursor-pointer rounded-full p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-bg-tag hover:text-bg-primaryBtn"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Delete />
            </div>
          )}
          <div
            className="cursor-pointer rounded-full p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-bg-tag hover:text-bg-primaryBtn"
            onClick={() => shareUrl(title, link)}
          >
            <Share />
          </div>
        </div>
      </div>
      <div>
        <h2 className="pt-4 text-xl font-semibold text-text-primary transition-colors duration-300 group-hover:text-text-secondaryBtn">
          {title}
        </h2>
      </div>
      <div className="pt-4">
        {type === "YouTube" && youtubeUrl && (
          <iframe
            className="aspect-video w-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
            src={youtubeUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
        {type === "Twitter/X" && isUrl && (
          <blockquote className="twitter-tweet">
            <a href={link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        )}
        {(type === "Document" && link) ||
          (!isUrl && (
            <div>
              <a
                href={link}
                className="cursor-pointer underline text-text-secondaryBtn"
              >
                Original Url
              </a>
            </div>
          ))}
      </div>

      <div className=" flex flex-wrap py-4">
        {tags?.map((t) => (
          <span
            key={t + Math.random()}
            className="m-1 rounded-full bg-bg-tag px-3 py-1 text-text-secondaryBtn transition-transform duration-300 hover:-translate-y-0.5"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="pt-6 text-text-secondary text-sm">
        <p>Added {dateCreated} ago</p>
      </div>
    </div>
  );
};
