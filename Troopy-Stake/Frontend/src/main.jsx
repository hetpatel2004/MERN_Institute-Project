import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Mainroute from "./Component/Router/Mainroute.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Mainroute />
    </BrowserRouter>
  </React.StrictMode>,
);
