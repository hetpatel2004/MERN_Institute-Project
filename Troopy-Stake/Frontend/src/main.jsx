import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";

const AppRoutes = React.lazy(() => import("./routes"));

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
