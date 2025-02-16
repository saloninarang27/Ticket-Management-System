import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct import
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Using createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
