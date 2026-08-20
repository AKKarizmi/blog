import "./index.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ForozDataProvider } from "./context/ForozDataContext";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <ForozDataProvider>
      <App />
    </ForozDataProvider>
  );
}

