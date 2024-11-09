// * Notes *
// created the warps functions and constant re-rendering on changes
// need to create a simple warp 
// then create warps re-rendering

import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  useHelper,
  Plane,
  Tube
} from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'
import './App.css'


// input weave array
type WeaveArray = number[][];
const basicWeave2DArray: WeaveArray = [
  [1, 0, 1, 0],
  [0, 1, 1, 1],
  [1, 0, 1, 0],
  [0, 1, 0, 1]
];

// * wefts functions *
type WeftProps = {
  weaveArray: WeaveArray;
  zPosition: number;
  color: string;
}
// creates 1 weft
const Weft: React.FC<WeftProps> = ({ weaveArray, zPosition, color }) => {
  const xPosition = ((weaveArray[0].length) + 0.2) / 2;
  const weftCurve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3((-1 * (xPosition)), 0, zPosition),
      new THREE.Vector3(xPosition, 0, zPosition)
    ]);
  }, [zPosition]);    // renders weftcurve only if zPosition changes
  return (
    <mesh>
      <tubeGeometry args={[weftCurve, 64, 0.1, 20, false]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
type WeftsProps = {
  weaveArray: WeaveArray;
  color: string;
  spacing: number;
}
// creates a grouping of wefts
const Wefts: React.FC<WeftsProps> = ({ weaveArray, color, spacing }) => {
  const numWefts = weaveArray.length;
  const startPosition = numWefts % 2 === 0
    ? (-1 * ((numWefts - 1) * (spacing / 2)))
    : (-1 * ((Math.floor(numWefts / 2)) * spacing));
  return (
    <>
      {Array.from({ length: numWefts }, (_, index) => {
        const zPosition = startPosition + index * spacing;
        return <Weft
          key={index}
          weaveArray={weaveArray}
          zPosition={zPosition}
          color={color}
        />
      })}
    </>
  );
};
// continuously renders the weft grouping
const ChangingWeft: React.FC = () => {
  const { color, spacing } = useControls({    // creating slider for spacing
    color: '#0000FF',
    spacing: {
      value: 1.0,
      min: 0.0,
      max: 5.0,
      step: 0.1
    }
  });
  return (      // returning the weft grouping
    <Wefts
      weaveArray={basicWeave2DArray}
      color={color}
      spacing={spacing}
    />
  );
};

// // * warp functions *
// type WarpProps = {
//   weaveArray: WeaveArray;
//   zPosition: number;
//   color: string;
// }
// // creates 1 weft
// const Warp: React.FC<WarpProps> = ({ weaveArray, zPosition, color }) => {
//   const xPosition = ((weaveArray[0].length) + 0.2) / 2;
//   const weftCurve = React.useMemo(() => {
//     return new THREE.CatmullRomCurve3([
//       new THREE.Vector3((-1 * (xPosition)), 0, zPosition),
//       new THREE.Vector3(xPosition, 0, zPosition)
//     ]);
//   }, [zPosition]);    // renders weftcurve only if zPosition changes
//   return (
//     <mesh>
//       <tubeGeometry args={[weftCurve, 64, 0.1, 20, false]} />
//       <meshStandardMaterial color={color} />
//     </mesh>
//   );
// };



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
          args={[10, 10]}
          rotation-x={-Math.PI * 0.5}
          position-y={-1}>
          <meshStandardMaterial color={"#DDDDDD"} />
        </Plane>
        <GizmoHelper alignment='top-left' margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>
        <primitive
          object={new THREE.GridHelper(10, 10, "#C0C0C0", "#C0C0C0")}
          position={[0, -0.9, 0]} />
        <axesHelper args={[10]} />

        {/* continuously rendering weft grouping */}
        <ChangingWeft />



        {/* lights */}
        <ambientLight intensity={0.5} color={'white'} />

      </Canvas>
    </div>
  ) // --- return end
} // --- app function end

export default App
