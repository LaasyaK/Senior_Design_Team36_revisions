import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WeaveVisualizationRenderer from "./WeaveVisualizationRenderer.tsx";
import ButtonsBar from "./ButtonsBar.tsx";
import { SharedStateProvider } from "./ButtonsSharedState.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SharedStateProvider>
      {/* weave rendering space */}
      <WeaveVisualizationRenderer />
      {/* floating buttons bar */}
      <ButtonsBar />
    </SharedStateProvider>
  </StrictMode>
);
