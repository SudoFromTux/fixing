
import Brain from "../Icons/Brain";
import { useNavigate } from "react-router-dom";

const AppTitle = () => {
  const navigate = useNavigate();

  return (
    <div
      className="group flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      onClick={() => navigate("/")}
    >
      <div className="transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
        <Brain />
      </div>
      <h1 className="text-text-primary font-semibold text-2xl">
        Brainly
      </h1>
    </div>
  );
};

export default AppTitle;
