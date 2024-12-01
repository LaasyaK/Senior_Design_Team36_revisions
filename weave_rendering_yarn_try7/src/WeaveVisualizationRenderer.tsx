// * Imports *
import ButtonsBar from "./ButtonsBar";
import { SharedStateProvider } from "./ButtonsSharedState";
import Rendering from "./Rendering";

export function WeaveVisualizationRenderer() {
  return (
    <SharedStateProvider>
      {/* weave rendering space */}
      <Rendering />
      {/* floating buttons bar */}
      <ButtonsBar />
    </SharedStateProvider>
  );
}
