import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Mainroute from "./Component/Router/Mainroute.jsx";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Mainroute />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
