import Bars from "../Icons/Bars";
import Share from "../Icons/Share";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { Theme } from "../../utils/theme";

interface HeaderProps {
  onBarsClick: () => void;
  onShareBrainClick: () => void;
  filterContent: string;
  theme: Theme;
  onThemeToggle: () => void;
}

const Header = ({
  onBarsClick,
  onShareBrainClick,
  filterContent,
  theme,
  onThemeToggle,
}: HeaderProps) => (
  <div className="mr-4 flex items-center justify-between text-text-primary">
    <div className="pl-2 md:hidden" onClick={onBarsClick}>
      <Bars />
    </div>
    <div className="pl-8">
      <h2 className="text-2xl font-semibold text-text-primary">
        {filterContent === "My Brain" ? "All Notes" : filterContent}
      </h2>
    </div>
    <div className="flex flex-wrap items-center justify-end gap-2 p-4">
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      <Button
        type="secondary"
        name="Share Brain"
        size="lg"
        beforeIcon={<Share />}
        onClickHandler={onShareBrainClick}
      />
      {/* <Button
        type="primary"
        name="Add Content"
        size="lg"
        beforeIcon={<Plus />}
        onClickHandler={onAddContentClick}
      /> */}
    </div>
  </div>
);

export default Header;
