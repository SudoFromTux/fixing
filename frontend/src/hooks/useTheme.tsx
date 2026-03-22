import { useEffect, useState } from "react";
import { applyTheme, getPreferredTheme, Theme } from "../utils/theme";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  return { theme, toggleTheme };
};

export default useTheme;

