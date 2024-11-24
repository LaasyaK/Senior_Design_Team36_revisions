import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WeaveVisualizationRenderer from "./WeaveVisualizationRenderer.tsx";
import ButtonsBar from "./ButtonsBar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* weave rendering space */}
    <WeaveVisualizationRenderer />
    {/* floating buttons bar */}
    <ButtonsBar />
  </StrictMode>
);
