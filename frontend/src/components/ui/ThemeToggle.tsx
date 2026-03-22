import Moon from "../Icons/Moon";
import Sun from "../Icons/Sun";
import { Theme } from "../../utils/theme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  const isDarkTheme = theme === "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} mode`}
      aria-pressed={isDarkTheme}
      className="flex items-center gap-3 rounded-full border border-border-soft bg-bg-surface px-3 py-2 text-text-primary shadow-sm transition-all hover:bg-bg-tag"
      onClick={onToggle}
    >
      <div className="text-text-secondaryBtn">
        {isDarkTheme ? <Moon /> : <Sun />}
      </div>
      <div className="relative h-6 w-11 rounded-full bg-bg-secondaryBtn p-0.5">
        <span
          className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-bg-primaryBtn text-white transition-transform ${
            isDarkTheme ? "translate-x-5" : "translate-x-0"
          }`}
        >
          {isDarkTheme ? <Moon /> : <Sun />}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;

