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
import "./WeaveVisualizationRenderer.css";
import { generateNewGrid } from "./weave_design_algorithm";
import { Wefts, Warps } from "./RenderingComponents.tsx";
import { useSharedState } from "./SharedState.tsx";

// input weave array
const basicWeave2DArray: boolean[][] = [
  [true, false, false, false],
  [false, true, false, false],
  [false, false, true, false],
  [false, false, false, true],
];

// * re-rendering weave with controls *
const TitleControls: React.FC = () => {
  const {
    show,
    show_loops,
    weft_spacing,
    weft_thickness,
    warp_spacing,
    warp_thickness,
    // set,
  } = useControls({
    show: {
      value: "Raw Weave Design",
      options: ["Raw Weave Design", "1 Layered Loop", "2 Layered Loops"],
    },
    show_loops: { value: false },
    weft_spacing: { value: 0.2, min: 0.0, max: 3.0, step: 0.01 },
    weft_thickness: { value: 0.1, min: 0.01, max: 0.6, step: 0.01 },
    warp_spacing: { value: 0.2, min: 0.0, max: 3.0, step: 0.01 },
    warp_thickness: { value: 0.1, min: 0.01, max: 0.6, step: 0.01 },
  });
  const number_of_layers = React.useMemo(() => {
    switch (show) {
      case "Raw Weave Design":
        return 1;
      case "1 Layered Loop":
        return 2;
      case "2 Layered Loops":
        return 4;
      default:
        return 1;
    }
  }, [show]);
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
        thickness={weft_thickness}
        weftSpacing={weft_spacing}
        warpSpacing={warp_spacing}
        numOfLayers={number_of_layers}
      />
      <Warps
        weaveArray={inputWeave}
        warpThickness={warp_thickness}
        weftThickness={weft_thickness}
        warpspacing={warp_spacing}
        weftSpacing={weft_spacing}
        numOfLayers={number_of_layers}
      />
    </>
  );
};

// * app running in main *
function WeaveVisualizationRenderer() {
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

  // function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
  //   const button = event.target as HTMLButtonElement;  // Type assertion
  //   const buttonName = button.innerText;
  //   console.log(`${buttonName} clicked!`);
  // }

  const { showGrid, showNavigationCube } = useSharedState();

  // GUI control
  // const { show_grid, show_navigation_cube } = useControls({
  //   show_grid: { value: true },
  //   show_navigation_cube: { value: true },
  // });

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
        <TitleControls />

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

export default WeaveVisualizationRenderer;
