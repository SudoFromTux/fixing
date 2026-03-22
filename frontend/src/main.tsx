import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { syncAuthSession } from "./utils/authSession.ts";
import { syncTheme } from "./utils/theme.ts";

syncAuthSession();
syncTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
