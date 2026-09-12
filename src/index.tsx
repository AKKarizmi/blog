import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ForozDataProvider } from "./context/ForozDataContext";

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <ForozDataProvider>
      <App />
    </ForozDataProvider>
  );
}