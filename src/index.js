import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/booking.css";
import { ROUTER_FUTURE } from "./routerConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={ROUTER_FUTURE}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
