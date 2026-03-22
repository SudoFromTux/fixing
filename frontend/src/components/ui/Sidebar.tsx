import AllContent from "../Icons/AllContent";
import Close from "../Icons/Close";
import Document from "../Icons/Document";
import Logout from "../Icons/Logout";
import Twitter from "../Icons/Twitter";
import YouTube from "../Icons/YouTube";
import { useNavigate } from "react-router-dom";
import AppTitle from "./AppTitle";
import { CSSProperties, Dispatch, SetStateAction, useState } from "react";
import logout from "../../utils/logout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../config/redux/store";
import Home from "../Icons/Home";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  switchFilter: (filter: string) => void;
  filterContent: string;
}

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  switchFilter,
  filterContent,
}: SidebarProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const content = useSelector((state: RootState) => state.content.content);
  const username = user?.username || content[0]?.userId.username || "Profile";
  const email =
    user?.email || content[0]?.userId.email || localStorage.getItem("isLoggedIn");
  const initials = username
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "P";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const goHome = () => {
    setIsProfileOpen(false);
    setIsSidebarOpen(false);
    navigate("/");
  };

  const logoutUser = () => {
    setIsProfileOpen(false);
    setIsSidebarOpen(false);
    void logout(navigate, dispatch);
  };

  const sideItems = [
    {
      name: "My Brain",
      icon: <AllContent />,
    },
    {
      name: "Tweets",
      icon: <Twitter />,
    },
    {
      name: "Videos",
      icon: <YouTube />,
    },
    {
      name: "Documents",
      icon: <Document />,
    },
  ];

  return (
    <div
      className={` ${
        isSidebarOpen &&
        "modal-backdrop block bg-black bg-opacity-60 w-screen h-screen fixed z-30 transition-all"
      }`}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return;
        setIsSidebarOpen(false);
      }}
    >
      <div
        className={`glass-panel motion-slide-left fixed min-h-screen border border-border-soft bg-bg-surface text-text-primary transition-all md:flex md:w-1/4 lg:w-1/6 sm:w-1/3 flex-col pl-4 ${
          isSidebarOpen ? "z-50 flex" : "hidden"
        }`}
        style={
          isSidebarOpen
            ? ({ "--motion-delay": "40ms" } as CSSProperties)
            : undefined
        }
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          if (e.target !== e.currentTarget) return;
          setIsProfileOpen(false);
        }}
      >
        <div className="motion-slide-left pt-4 pl-1 lg:pl-6 sm:pl-4 flex items-center justify-between gap-2 pb-8 md:pb-16">
          <AppTitle />
          {isSidebarOpen && (
            <div className="" onClick={() => setIsSidebarOpen(false)}>
              <Close />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:pl-4 md:pl-0 lg:pl-6  mb-20">
          {sideItems.map(({ name, icon }, index) => (
            <ul
              key={name}
              className={`motion-slide-left flex gap-2 items-center text-lg cursor-pointer hover:bg-bg-tag px-2 py-1 transition-all rounded-l-lg ${
                filterContent === name && "bg-bg-tag"
              }`}
              style={
                { "--motion-delay": `${120 + index * 70}ms` } as CSSProperties
              }
              onClick={() => switchFilter(name)}
            >
              <div>{icon}</div> <p className="text-base">{name}</p>
            </ul>
          ))}
        </div>

        <div className="mt-auto flex flex-col items-start gap-3 pb-10 pr-4 sm:pl-4 md:pl-0 lg:pl-6">
          {isProfileOpen && (
            <div className="motion-pop w-full max-w-[240px] overflow-hidden rounded-[1.5rem] border border-border-soft bg-bg-surface/95 shadow-[0_22px_48px_rgba(15,23,42,0.16)] backdrop-blur-xl">
              <div className="border-b border-border-soft px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-bg-tag text-sm font-semibold text-text-secondaryBtn">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {username}
                    </p>
                    <p className="truncate text-xs text-text-secondary">
                      {email || "Signed in"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="rounded-2xl bg-bg-main/80 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                    Total Content
                  </p>
                  <p className="pt-1 text-base font-semibold text-text-primary">
                    {content.length}
                  </p>
                </div>
              </div>

              <div className="border-t border-border-soft p-2">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-sm text-text-primary transition-all duration-300 hover:bg-bg-tag"
                  onClick={goHome}
                >
                  <Home />
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-sm text-text-primary transition-all duration-300 hover:bg-bg-tag"
                  onClick={logoutUser}
                >
                  <Logout />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            aria-label="Open profile menu"
            className={`motion-slide-left flex size-16 items-center justify-center rounded-full border bg-bg-surface/90 text-text-secondaryBtn shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
              isProfileOpen
                ? "border-bg-primaryBtn/40 ring-4 ring-bg-primaryBtn/10"
                : "border-border-soft"
            }`}
            style={{ "--motion-delay": "420ms" } as CSSProperties}
            onClick={toggleProfile}
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-bg-tag text-sm font-semibold">
              {initials}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
