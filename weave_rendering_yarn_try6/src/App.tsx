// * Notes *
// add buttons to tile to match the theme of the layout that control variable functions
//    add a button to toggle grid
//    toggle gizmo cube (and make it smaller)
// color code each layer and differnt shades for the weft and warp

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


// input weave array
const basicWeave2DArray: number[][] = [
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],   // B
  [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0],   // C2
  [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],   // C1
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],   // F
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0],
  [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  [1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
// F C1 C2  B

// * wefts functions *
type WeftProps = {
  weaveArray: number[][];
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
      new THREE.Vector3(startPosition - 0.6, yPosition, zPosition),   // offsetting with extra noodle
      new THREE.Vector3((startPosition + (numWarps - 1) * warpSpacing) + 0.6, yPosition, zPosition)
    ]);
  }, [weaveArray, zPosition, warpSpacing]);    // renders weftcurve only if zPosition changes
  // get start and end end of the path
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
  weaveArray: number[][];
  color: string;
  thickness: number;
  weftSpacing: number;
  warpSpacing: number;
}
// creates a grouping of wefts
const Wefts: React.FC<WeftsProps> = ({ weaveArray, color, thickness, weftSpacing, warpSpacing }) => {
  const numWefts = weaveArray.length;
  const startPosition = numWefts % 2 === 0
    ? (-1 * ((numWefts - 1) * (weftSpacing / 2)))
    : (-1 * ((Math.floor(numWefts / 2)) * weftSpacing));
  return (
    <>
      {Array.from({ length: numWefts }, (_, index) => {
        const zPosition = startPosition + index * weftSpacing;    // alters next weft based on spacing
        const yPosition = index % 4;
        // console.log("y")
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
  weaveArray: number[][];
  warpRow: number[];
  xPosition: number;
  color: string;
  warpThickness: number;
  weftThickness: number
  weftSpacing: number;
  layer: number;
}
// creates 1 weft
const Warp: React.FC<WarpProps> = ({ weaveArray, warpRow, xPosition, color, warpThickness, weftThickness, weftSpacing, layer }) => {
  const warpCurve = React.useMemo(() => {
    let warpArrayPoints = [];
    const numWefts = weaveArray.length;     // determing the start z position
    const startPosition = numWefts % 2 === 0
      ? (-1 * ((numWefts - 1) * (weftSpacing / 2)))
      : (-1 * (Math.floor(numWefts / 2)) * weftSpacing);
    // 1st 2 warp point outside weft
    warpArrayPoints.push(new THREE.Vector3(xPosition, layer, startPosition - (1.6 * (warpThickness + weftThickness))));
    warpArrayPoints.push(new THREE.Vector3(xPosition, layer, startPosition - (1.4 * (warpThickness + weftThickness))));
    for (let i = layer; i < warpRow.length; i = i + 4) {
      const yPosition = warpRow[i] === 1
        ? ((weftThickness + warpThickness) + layer)
        : ((-1 * (weftThickness) - warpThickness) + layer);
      console.log("layer: " + layer + " array value: " + warpRow[i]);
      warpArrayPoints.push(new THREE.Vector3(xPosition, yPosition, startPosition + i * weftSpacing));
    }
    // last 2 warp point outside of the warp
    warpArrayPoints.push(new THREE.Vector3(xPosition, layer, startPosition + (warpRow.length - 1) * weftSpacing + (1.4 * (warpThickness + weftThickness))));
    warpArrayPoints.push(new THREE.Vector3(xPosition, layer, startPosition + (warpRow.length - 1) * weftSpacing + (1.6 * (warpThickness + weftThickness))));
    return new THREE.CatmullRomCurve3(warpArrayPoints);
  }, [weaveArray, warpRow, xPosition, warpThickness, weftThickness, weftSpacing]);
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
  weaveArray: number[][];
  color: string;
  warpThickness: number;
  weftThickness: number;
  warpspacing: number;
  weftSpacing: number;
}
// creates a grouping of wefts
const Warps: React.FC<WarpsProps> = ({ weaveArray, color, warpThickness, warpspacing, weftThickness, weftSpacing }) => {
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
        const layer = 3 - (index % 4);
        return <Warp
          key={index}
          weaveArray={basicWeave2DArray}
          xPosition={xPosition}
          warpRow={row}
          color={color}
          weftThickness={weftThickness}
          warpThickness={warpThickness}
          weftSpacing={weftSpacing}
          layer={layer}
        />
      })}
    </>
  );
};

// * re-rendering weave *
const ChangingWeave: React.FC = () => {
  const {
    weft_color,
    weft_spacing,
    weft_thickness,
    warp_color,
    warp_spacing,
    warp_thickness } = useControls({    // creating sliders
      weft_color: '#1D6CED',
      weft_spacing: {
        value: 0.1,
        min: 0.0,
        max: 5.0,
        step: 0.1
      },
      weft_thickness: {
        value: 0.1,
        min: 0.01,
        max: 0.6,
        step: 0.01
      },
      warp_color: '#7CAAF4',
      warp_spacing: {
        value: 0.1,
        min: 0.0,
        max: 5.0,
        step: 0.1
      },
      warp_thickness: {
        value: 0.1,
        min: 0.01,
        max: 0.6,
        step: 0.01
      }
    });
  return (      // returning the weft and warp grouping
    <><Wefts
      weaveArray={basicWeave2DArray}
      color={weft_color}
      thickness={weft_thickness}
      weftSpacing={weft_spacing}
      warpSpacing={warp_spacing} />
      <Warps
        weaveArray={basicWeave2DArray}
        color={warp_color}
        warpThickness={warp_thickness}
        weftThickness={weft_thickness}
        warpspacing={warp_spacing}
        weftSpacing={weft_spacing} />
    </>
  );
};

// * app running in main *
function App() {

  return (
    <div id="canvas-container">

      {/* background canvas */}
      <Canvas
        style={{ backgroundColor: "#222222" }}
        camera={{ position: [2, 2, 2] }}>
        <OrbitControls />

        {/* plane and helpers */}
        <Plane
          args={[20, 20]}
          rotation-x={-Math.PI * 0.5}
          position-y={-1.05}>
          <meshStandardMaterial color={"#DDDDDD"} />
        </Plane>
        <GizmoHelper alignment='top-left' margin={[60, 60]} >
          <GizmoViewport />
        </GizmoHelper>
        <primitive
          object={new THREE.GridHelper(20, 20, "#C0C0C0", "#C0C0C0")}
          position={[0, -1, 0]} />
        <axesHelper args={[10]} />

        {/* continuously rendering weave */}
        <ChangingWeave />

        {/* lights */}
        <ambientLight intensity={0.8} color={'white'} />
        <directionalLight
          color={"white"}
          intensity={0.9}
          position={[25, 25, 0]}
        />

      </Canvas>
    </div>
  ) // --- return end
} // --- app function end

export default App
