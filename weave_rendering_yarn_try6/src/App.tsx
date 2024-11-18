// * Notes *
// add better limits to the spacing of the weft and warp so can't go too small [I say not important yet]
// add buttons to tile to match the theme of the layout that control variable functions [*]
// color based on theme of app from index.css theme colors in hsl [*]
//    can only use hsl in strings in the html tag code, not in the ts code
// include side by side views of all layer, toggle w/ button [*]

// * PROGRESS *
//    fixed 1 and 4 layers
//    need to make 2 layers happen


// next week: 
//    buttons on canvs hardcoded
//    use weave struct data and carmella's algorithm to create viz (layer input in the viz tile)
//    color scheme the weft and warp for each layer
// -  use real theme to adapt theme of viz to app's theme (use realTheme to determine if 'light' or 'dark' to set a light or dark color)

//  WHEN COPYING OVER TO lOOM3D FILES DONT COPY AND PASTE THE WHOLE DOC

import React/*, { useMemo, useRef, useEffect } */ from 'react';
import { Canvas/*, useFrame*/ } from '@react-three/fiber'
import {
  OrbitControls,
  GizmoHelper,
  /*GizmoViewcube,*/
  GizmoViewport,
  /*useHelper,*/
  Plane,
  /*Tube*/
} from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'
import './App.css'
import { generateNewGrid } from './weave_design_algorithm'


// input weave array
// const basicWeave2DArray: number[][] = [
//   [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],   // B
//   [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0],   // C2
//   [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],   // C1
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],   // F
//   [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0],
//   [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
//   [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0],
//   [1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
//   [1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
//   [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];
// // F C1 C2  B
const basicWeave2DArray: boolean[][] = [
  [true, false, false, false],
  [false, true, false, false],
  [false, false, true, false],
  [false, false, false, true]
];

// * wefts functions *
type WeftProps = {
  weaveArray: boolean[][];
  yPosition: number;
  zPosition: number;
  color: string;
  thickness: number;
  warpSpacing: number;
}
// creates 1 weft
const Weft: React.FC<WeftProps> = ({ weaveArray, yPosition, zPosition, color, thickness, warpSpacing }) => {
  const numWarps = weaveArray[0].length;
  const startPosition = numWarps % 2 === 0
    ? (-1 * ((numWarps - 1) * (warpSpacing / 2)))
    : (-1 * (Math.floor(numWarps / 2) * warpSpacing));
  const weftCurve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(startPosition - 0.6, yPosition, zPosition),   // yarn noodle ends have extra yarn
      new THREE.Vector3((startPosition + (numWarps - 1) * warpSpacing) + 0.6, yPosition, zPosition)
    ]);
  }, [weaveArray, yPosition, zPosition, warpSpacing]);    // renders weftcurve when these change
  // get start and end end of the path for circles
  const startPoint = weftCurve.getPoint(0);
  const endPoint = weftCurve.getPoint(1);
  return (
    <>
      {/* warp noodle */}
      <mesh>
        <tubeGeometry args={[weftCurve, 100, thickness, 30, false]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.9}
          clearcoat={0.1}
          clearcoatRoughness={0.7}
        />
        {/* start and end circles of warp noodle */}
      </mesh>
      <mesh position={startPoint} rotation={[0, -1 * (Math.PI / 2), 0]}>
        <circleGeometry args={[thickness, 20]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={endPoint} rotation={[0, (Math.PI / 2), 0]}>
        <circleGeometry args={[thickness, 20]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
};
type WeftsProps = {
  weaveArray: boolean[][];
  color: string;
  thickness: number;
  weftSpacing: number;
  warpSpacing: number;
  numOfLayers: number;
}
// creates a grouping of wefts
const Wefts: React.FC<WeftsProps> = ({ weaveArray, color, thickness, weftSpacing, warpSpacing, numOfLayers }) => {
  const numWefts = weaveArray.length;
  const startPosition = numWefts % 2 === 0
    ? (-1 * ((numWefts - 1) * (weftSpacing / 2)))
    : (-1 * ((Math.floor(numWefts / 2)) * weftSpacing));
  return (
    <>
      {Array.from({ length: numWefts }, (_, index) => {
        const zPosition = startPosition + index * weftSpacing;    // alters next weft based on spacing
        const yPosition =
          numOfLayers === 1 ? 0 :
            numOfLayers === 2 ? Math.floor(index / 2) % 2 :
              numOfLayers === 4 ? index % 4 :
                0;
        return <Weft
          key={index}
          weaveArray={weaveArray}
          yPosition={yPosition}
          zPosition={zPosition}
          color={color}
          thickness={thickness}
          warpSpacing={warpSpacing}
        />
      })}
    </>
  );
};

// * warp functions *
type WarpProps = {
  weaveArray: boolean[][];
  warpRow: boolean[];
  xPosition: number;
  color: string;
  warpThickness: number;
  weftThickness: number
  weftSpacing: number;
  layer: number;
  numOfLayers: number;
}
// creates 1 weft
const Warp: React.FC<WarpProps> = ({ weaveArray, warpRow, xPosition, color, warpThickness, weftThickness, weftSpacing, layer, numOfLayers }) => {
  const warpCurve = React.useMemo(() => {
    let warpArrayPoints = [];
    const numWefts = weaveArray.length;     // determing the start z position
    const startPosition = numWefts % 2 === 0
      ? (-1 * ((numWefts - 1) * (weftSpacing / 2)))
      : (-1 * (Math.floor(numWefts / 2)) * weftSpacing);
    // warp based of num of layers rendering
    const increment =
      numOfLayers === 1 ? 1 :
        numOfLayers === 2 ? 4 :
          numOfLayers === 4 ? 4 :
            1;
    // 1st 2 warp point outside weft
    warpArrayPoints.push(new THREE.Vector3(xPosition, layer, startPosition - (1.6 * (warpThickness + weftThickness))));
    warpArrayPoints.push(new THREE.Vector3(xPosition, layer, startPosition - (1.4 * (warpThickness + weftThickness))));
    for (let i = layer; i < warpRow.length; i = i + increment) {
      const yPosition = warpRow[i] === true
        ? ((weftThickness + warpThickness) + layer)
        : ((-1 * (weftThickness) - warpThickness) + layer);
      warpArrayPoints.push(new THREE.Vector3(xPosition, yPosition, startPosition + i * weftSpacing));
    }
    // last 2 warp point outside of the warp
    warpArrayPoints.push(new THREE.Vector3(xPosition, layer, startPosition + (warpRow.length - 1) * weftSpacing + (1.4 * (warpThickness + weftThickness))));
    warpArrayPoints.push(new THREE.Vector3(xPosition, layer, startPosition + (warpRow.length - 1) * weftSpacing + (1.6 * (warpThickness + weftThickness))));
    return new THREE.CatmullRomCurve3(warpArrayPoints);
  }, [weaveArray, warpRow, xPosition, warpThickness, weftThickness, weftSpacing, layer, numOfLayers]);
  const startPoint = warpCurve.getPoint(0);
  const endPoint = warpCurve.getPoint(1);
  return (
    <>
      {/* weft noodle */}
      <mesh>
        <tubeGeometry args={[warpCurve, 100, warpThickness, 30, false]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.9}
          clearcoat={0.1}
          clearcoatRoughness={0.7}
        />
      </mesh>
      {/* start and end circles of of weft noodle */}
      <mesh position={startPoint} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[warpThickness, 20]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={endPoint} >
        <circleGeometry args={[warpThickness, 20]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
};
type WarpsProps = {
  weaveArray: boolean[][];
  color: string;
  warpThickness: number;
  weftThickness: number;
  warpspacing: number;
  weftSpacing: number;
  numOfLayers: number;
}
// creates a grouping of wefts
const Warps: React.FC<WarpsProps> = ({ weaveArray, color, warpThickness, warpspacing, weftThickness, weftSpacing, numOfLayers }) => {
  const transposedArray = weaveArray[0].map((_, colIndex) => weaveArray.map(row => row[colIndex]));
  const numWarps = weaveArray[0].length;
  const startPosition = numWarps % 2 === 0
    ? (-1 * ((numWarps - 1) * (warpspacing / 2)))
    : (-1 * ((Math.floor(numWarps / 2)) * warpspacing));
  return (
    <>
      {Array.from({ length: transposedArray.length }, (_, index) => {
        const row = transposedArray[index];
        const xPosition = startPosition + index * warpspacing;    // alters next warp based on spacing
        const layer =
          numOfLayers === 1 ? 0 :
            numOfLayers === 2 ? 1 - (index % 2) :
              numOfLayers === 3 ? 0 :
                numOfLayers === 4 ? 3 - (index % 4) :
                  index;
        return <Warp
          key={index}
          weaveArray={weaveArray}
          xPosition={xPosition}
          warpRow={row}
          color={color}
          weftThickness={weftThickness}
          warpThickness={warpThickness}
          weftSpacing={weftSpacing}
          layer={layer}
          numOfLayers={numOfLayers}
        />
      })}
    </>
  );
};

// * re-rendering weave *
const ChangingWeave: React.FC = () => {
  const {
    number_of_layers,
    weft_color,
    weft_spacing,
    weft_thickness,
    warp_color,
    warp_spacing,
    warp_thickness } = useControls({    // creating sliders
      number_of_layers: { value: 4, min: 1, max: 4, step: 1 },
      weft_color: '#1D6CED',
      weft_spacing: { value: 0.2, min: 0.0, max: 3.0, step: 0.01 },
      weft_thickness: { value: 0.1, min: 0.01, max: 0.6, step: 0.01 },
      warp_color: '#7CAAF4',
      warp_spacing: { value: 0.2, min: 0.0, max: 3.0, step: 0.01 },
      warp_thickness: { value: 0.1, min: 0.01, max: 0.6, step: 0.01 }
    });
  // determining weave design based on num of layers to render
  const inputWeave = React.useMemo(() => {
    if (number_of_layers == 1) {
      return basicWeave2DArray;
    }
    else if (number_of_layers == 2) {
      const bothWeaves = generateNewGrid(basicWeave2DArray);
      return bothWeaves.newGrid;
    }
    else if (number_of_layers == 4) {
      const bothWeaves = generateNewGrid(basicWeave2DArray);
      return bothWeaves.newGrid;
    }
    else {
      return basicWeave2DArray;
    }
  }, [number_of_layers]);
  return (      // returning the weft and warp grouping
    <>
      <Wefts
        weaveArray={inputWeave}
        color={weft_color}
        thickness={weft_thickness}
        weftSpacing={weft_spacing}
        warpSpacing={warp_spacing}
        numOfLayers={number_of_layers} />
      <Warps
        weaveArray={inputWeave}
        color={warp_color}
        warpThickness={warp_thickness}
        weftThickness={weft_thickness}
        warpspacing={warp_spacing}
        weftSpacing={weft_spacing}
        numOfLayers={number_of_layers} />
    </>
  );
};

// * app running in main *
function App() {
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
  return (
    <div id="canvas-container">

      {/* background canvas */}
      <Canvas
        style={{ backgroundColor: renderingBackgroundColor }}
        camera={{ position: [2, 2, 2] }}
        resize={{ debounce: 0 }}
      >
        <OrbitControls />

        {/* plane and helpers */}
        <Plane args={[20, 20]} rotation-x={-Math.PI * 0.5} position-y={-1.05}>
          <meshBasicMaterial color={renderingPlaneColor} />
        </Plane>
        <GizmoHelper alignment="top-left" margin={[50, 50]} >
          <GizmoViewport />
        </GizmoHelper>
        <primitive
          object={new THREE.GridHelper(20, 20, renderingGridColor, renderingGridColor)}
          position={[0, -1, 0]} />
        <axesHelper args={[10]} />

        {/* continuously rendering weave */}
        <ChangingWeave />

        {/* lights */}
        <ambientLight intensity={(renderingLightIntensity - 0.3)} color={'white'} />
        <directionalLight color={'white'} intensity={renderingLightIntensity} position={[20, 20, 0]} />
      </Canvas>

    </div>
  ) // --- return end
} // --- app function end

export default App
