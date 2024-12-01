// * Imports *
import React /*, { useMemo, useRef, useEffect } */ from "react";
import { Canvas /*, useFrame*/ } from "@react-three/fiber";
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  /*useHelper,*/
  Plane,
  /*Tube*/
} from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import "./Rendering.css";
import { generateNewGrid } from "./WeaveDesignAlgorithim.tsx";
import { Wefts, Warps } from "./RenderingComponents.tsx";
import { useSharedState } from "./ButtonsSharedState.tsx";

// input weave array
const basicWeave2DArray: boolean[][] = [
  [true, false, false, false],
  [false, true, false, false],
  [false, false, true, false],
  [false, false, false, true],
];

// * re-rendering weave *
const WeaveRendering: React.FC = () => {
  const {
    displayOption,
    weftSpacing,
    weftThickness,
    warpSpacing,
    warpThickness,
  } = useSharedState();

  const { show_loops } = useControls({
    show_loops: { value: false },
  });
  const number_of_layers = React.useMemo(() => {
    switch (displayOption) {
      case "raw":
        return 1;
      case "one":
        return 2;
      case "two":
        return 4;
      default:
        return 1;
    }
  }, [displayOption]);
  // determining weave design based on num of layers to render
  const inputWeave = React.useMemo(() => {
    if (number_of_layers == 1) {
      return basicWeave2DArray;
    } else if (number_of_layers == 2 || number_of_layers == 4) {
      const bothWeaves = generateNewGrid(basicWeave2DArray);
      return bothWeaves.newGrid;
    } else {
      return basicWeave2DArray;
    }
  }, [number_of_layers]);

  return (
    // returning the weft and warp grouping
    <>
      <Wefts
        weaveArray={inputWeave}
        thickness={weftThickness}
        weftSpacing={weftSpacing}
        warpSpacing={warpSpacing}
        numOfLayers={number_of_layers}
      />
      <Warps
        weaveArray={inputWeave}
        warpThickness={warpThickness}
        weftThickness={weftThickness}
        warpspacing={warpSpacing}
        weftSpacing={weftSpacing}
        numOfLayers={number_of_layers}
      />
    </>
  );
};

// * app running in main *
function Rendering() {
  // const { realTheme } = useTheme();       // change background, plane, lighting, and grid color according to app theme
  let renderingBackgroundColor: string;
  let renderingPlaneColor: string;
  let renderingGridColor: string;
  let renderingLightIntensity: number;
  // hardcoding to light theme
  renderingBackgroundColor = "#D8D8D8";
  renderingPlaneColor = "#FFFFFF";
  renderingGridColor = "#FFFFFF";
  renderingLightIntensity = 2;

  const { showGrid, showNavigationCube } = useSharedState(); // used to show grid and nav box

  return (
    <div id="canvas-container">
      {/* rendering background canvas */}
      <Canvas
        style={{ backgroundColor: renderingBackgroundColor }}
        camera={{ position: [2, 2, 2] }}
        resize={{ debounce: 0 }}
      >
        <OrbitControls />

        {/* plane, nav cube, and grid */}
        <Plane args={[20, 20]} rotation-x={-Math.PI * 0.5} position-y={-1.05}>
          <meshBasicMaterial color={renderingPlaneColor} />
        </Plane>

        {/* <axesHelper args={[10]} /> */}
        {showNavigationCube && (
          <GizmoHelper alignment="top-left" margin={[50, 50]}>
            <GizmoViewcube color={renderingGridColor} />
          </GizmoHelper>
        )}
        {showGrid && (
          <primitive
            object={
              new THREE.GridHelper(
                20,
                20,
                renderingGridColor,
                renderingGridColor
              )
            }
            position={[0, -1, 0]}
          />
        )}

        {/* controls variables for re-rendering */}
        <WeaveRendering />

        {/* lights */}
        <ambientLight
          intensity={renderingLightIntensity - 0.3}
          color={"white"}
        />
        <directionalLight
          color={"white"}
          intensity={renderingLightIntensity}
          position={[20, 20, 0]}
        />
      </Canvas>
    </div>
  ); // --- return end
} // --- app function end

export default Rendering;
