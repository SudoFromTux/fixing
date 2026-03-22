// Dashboard Component
import { CSSProperties, useEffect, useState } from "react";
import AddContentModal from "../components/ui/AddContentModal";
import Sidebar from "../components/ui/Sidebar";
import useContent from "../hooks/useContent";
import { ToastContainer } from "react-toastify";
import PopUpModal from "../components/ui/PopUpModal";
import { shareModalText, shareModalTitle } from "../config/config";
import Header from "../components/ui/Header";
import ContentSection from "../components/ui/ContentSection";
import filterData from "../utils/filterData";
import { useSelector } from "react-redux";
import { RootState } from "../config/redux/store";
import { Content } from "../config/redux/contentSlice";
import Plus from "../components/Icons/Plus";
import useTheme from "../hooks/useTheme";

const Dashboard = () => {
  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterContent, setFilterContent] = useState("My Brain");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Fetch content using custom hook
  useContent("/content", { requiresAuth: true });

  // Get content from Redux store
  const content = useSelector((state: RootState) => state.content.content);

  // Filtered content for rendering
  const [dataToRender, setDataToRender] = useState<Content[]>(content);

  useEffect(() => {
    setDataToRender(content); // Update UI state when Redux content changes
  }, [content]);

  // Modal Handlers
  const toggleAddContentModal = () => setIsModalOpen((prev) => !prev);
  const toggleShareModal = () => setIsShareModalOpen((prev) => !prev);

  // Sidebar Filter
  const switchFilter = (filter: string) => {
    setFilterContent(filter);
    setIsSidebarOpen(false);
  };

  useEffect(
    () => filterData(filterContent, content, setDataToRender),
    [filterContent, content]
  );

  // JSX Render
  return (
    <div className="relative flex min-h-screen w-screen overflow-hidden bg-bg-main">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-orb motion-float right-[-5rem] top-20 h-72 w-72 bg-bg-primaryBtn/15" />
        <div className="ambient-orb motion-float-delayed left-[18%] top-[32%] h-56 w-56 bg-bg-secondaryBtn/80" />
      </div>
      {/* Modals */}

      <AddContentModal
        isModalOpen={isModalOpen}
        onModalClose={toggleAddContentModal}
      />

      {isShareModalOpen && (
        <PopUpModal
          isShareModal={isShareModalOpen}
          closeModal={toggleShareModal}
          text={shareModalText}
          title={shareModalTitle}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        filterContent={filterContent}
        switchFilter={switchFilter}
      />

      {/* Main Content */}
      <div className="relative z-10 ml-auto flex w-full flex-col justify-end bg-bg-main md:w-3/4 lg:w-5/6">
        <Header
          onBarsClick={() => setIsSidebarOpen(true)}
          onAddContentClick={toggleAddContentModal}
          onShareBrainClick={toggleShareModal}
          filterContent={filterContent}
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        <ContentSection dataToRender={dataToRender} />
      </div>

      <button
        aria-label="Add Content"
        title="Add Content"
        className="interactive-button pulse-ring motion-fade-up fixed bottom-6 right-6 z-40 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-4 border-bg-surface bg-bg-primaryBtn text-white shadow-2xl hover:bg-opacity-90"
        style={{ "--motion-delay": "280ms" } as CSSProperties}
        onClick={toggleAddContentModal}
      >
        <Plus />
      </button>

      <ToastContainer autoClose={5000} closeOnClick position="top-center" />
    </div>
  );
};

export default Dashboard;
