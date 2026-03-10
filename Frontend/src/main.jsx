import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { Analytics } from "@vercel/analytics/react";
import "./styles/global.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Analytics />
    </ThemeProvider>
  </StrictMode>,
);
