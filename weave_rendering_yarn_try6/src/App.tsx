// * Notes for future *
//    calculate limits so program prevents spacing being too small and tubes intersect
//    button to change views (ex: orthographic, isometric)
//    change orbit controls to not use right-click

// * Present To Do *
//    add buttons to tile to match the theme of the layout that control variable functions [*]
//    color based on theme of app from index.css theme colors in hsl [*]
//    can only use hsl in strings in the html tag code, not in the ts code
// next week: 
//    buttons on canvs hardcoded
//    use weave struct data and carmella's algorithm to create viz (layer input in the viz tile)
//    color scheme the weft and warp for each layer
// -  use real theme to adapt theme of viz to app's theme (use realTheme to determine if 'light' or 'dark' to set a light or dark color)

// * PROGRESS *
//    cant get the conditional dropboxes to work
//    got weft start and end points to save to an array but wont update when wefts re-renders

// * Buttons on tile *
// show raw weave design or render
//    render 1 or 2 loops
// number of layers
// weft spacing
// weft thickness
// warp spacing
// warp thickness
// grid toggle
// connect weft to show how the loops would look
// hide all buttons
// hide the gizmo
// mouse intructions
// maybeee can change colors (may want them to be default)

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
const Weft: React.FC<WeftProps & { pointsRef: React.MutableRefObject<THREE.Vector3[][]> }> = ({ weaveArray, yPosition, zPosition, color, thickness, warpSpacing, pointsRef }) => {
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
  // get start and end end of the path for circles and push into array
  const startPoint = weftCurve.getPoint(0);
  const endPoint = weftCurve.getPoint(1);

  React.useEffect(() => {
    pointsRef.current.push([startPoint, endPoint]);
  }, [weaveArray, yPosition, zPosition, thickness, warpSpacing, pointsRef, startPoint, endPoint]);

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
  thickness: number;
  weftSpacing: number;
  warpSpacing: number;
  numOfLayers: number;
}
// creates a grouping of wefts
const Wefts: React.FC<WeftsProps> = ({ weaveArray, thickness, weftSpacing, warpSpacing, numOfLayers }) => {
  const numWefts = weaveArray.length;
  const startPosition = numWefts % 2 === 0
    ? (-1 * ((numWefts - 1) * (weftSpacing / 2)))
    : (-1 * ((Math.floor(numWefts / 2)) * weftSpacing));
  // emptying array of points ref
  const pointsRef = React.useRef<THREE.Vector3[][]>([]);
  pointsRef.current = [];

  // TEST
  React.useEffect(() => {
    console.log("Collected points:", pointsRef);
  }, []);

  return (
    <>
      {Array.from({ length: numWefts }, (_, index) => {
        const zPosition = startPosition + index * weftSpacing;    // alters next weft based on spacing
        const yPosition =
          numOfLayers === 1 ? 0 :
            numOfLayers === 2 ? index % 4 :
              numOfLayers === 4 ? index % 4 :
                0;
        let weftColor;
        if (numOfLayers === 1) {
          weftColor = "#70C1FF";
        }
        else {
          weftColor =
            index % 4 === 0 ? "#FF8591" :
              index % 4 === 1 ? "#9585FF" :
                index % 4 === 2 ? "#F9B577" :
                  index % 4 === 3 ? "#70C1FF" :
                    "#808080";
        }
        // this needs to run every other index (even indexes)
        // if (index % 2 == 0) {
        // const mid = pointsRef[index][1].clone().add(pointsRef[index + 1][1]).multiplyScalar(0.5).add(new THREE.Vector3())
        // const curve = new THREE.CatmullRomCurve3([pointsRef[index][1], pointsRef[index + 1][1]]);
        // }
        // pointsRef[index][1] to get end point of 1st weft and pointsRef[index+1][1] make a curve out of it
        // create a mid point and add to curve 
        // with curve make a tubegeometry
        return <Weft
          key={index}
          weaveArray={weaveArray}
          yPosition={yPosition}
          zPosition={zPosition}
          color={weftColor}
          thickness={thickness}
          warpSpacing={warpSpacing}
          pointsRef={pointsRef}
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
  warpThickness: number;
  weftThickness: number;
  warpspacing: number;
  weftSpacing: number;
  numOfLayers: number;
}
// creates a grouping of wefts
const Warps: React.FC<WarpsProps> = ({ weaveArray, warpThickness, warpspacing, weftThickness, weftSpacing, numOfLayers }) => {
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
            numOfLayers === 2 ? 3 - (index % 4) :
              numOfLayers === 4 ? 3 - (index % 4) :
                0;
        let warpColor;
        if (numOfLayers === 1) {
          warpColor = "#0068B8";
        }
        else {
          warpColor =
            index % 4 === 3 ? "#B80012" :
              index % 4 === 2 ? "#3D1FFF" :
                index % 4 === 1 ? "#C46308" :
                  index % 4 === 0 ? "#0068B8" :
                    "#808080";
        }
        return <Warp
          key={index}
          weaveArray={weaveArray}
          xPosition={xPosition}
          warpRow={row}
          color={warpColor}
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
const TitleControls: React.FC = () => {
  const {
    show,
    show_loops,
    show_navigation_cube,
    weft_spacing,
    weft_thickness,
    warp_spacing,
    warp_thickness } = useControls({    // creating controls
      show: { value: "Raw Weave Design", options: ["Raw Weave Design", "1 Layered Loop", "2 Layered Loops"] },
      show_loops: { value: false },
      show_navigation_cube: { value: true },
      weft_spacing: { value: 0.2, min: 0.0, max: 3.0, step: 0.01 },
      weft_thickness: { value: 0.1, min: 0.01, max: 0.6, step: 0.01 },
      warp_spacing: { value: 0.2, min: 0.0, max: 3.0, step: 0.01 },
      warp_thickness: { value: 0.1, min: 0.01, max: 0.6, step: 0.01 },
    });
  const number_of_layers =
    (show === "Raw Weave Design") ? 1 :
      (show === "1 Layered Loop") ? 2 :
        (show === "2 Layered Loops") ? 4 :
          1;
  // determining weave design based on num of layers to render
  const inputWeave = React.useMemo(() => {
    if (number_of_layers == 1) {
      return basicWeave2DArray;
    }
    else if (number_of_layers == 2 || number_of_layers == 4) {
      const bothWeaves = generateNewGrid(basicWeave2DArray);
      return bothWeaves.newGrid;
    }
    else {
      return basicWeave2DArray;
    }
  }, [number_of_layers]);

  return (      // returning the weft and warp grouping
    <>
      {show_navigation_cube && (
        <GizmoHelper alignment="top-left" margin={[50, 50]} >
          <GizmoViewport />
        </GizmoHelper>
      )}
      <Wefts
        weaveArray={inputWeave}
        thickness={weft_thickness}
        weftSpacing={weft_spacing}
        warpSpacing={warp_spacing}
        numOfLayers={number_of_layers} />
      <Warps
        weaveArray={inputWeave}
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

  // function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
  //   const button = event.target as HTMLButtonElement;  // Type assertion
  //   const buttonName = button.innerText;
  //   console.log(`${buttonName} clicked!`);
  // }

  const { grid } = useControls({      // creates GUI to toggle showing grid
    grid: { value: true }
  });

  return (
    <div id="canvas-container">

      {/* rendering background canvas */}
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
        <axesHelper args={[10]} />

        {/* grid */}
        {grid && (
          <primitive
            object={new THREE.GridHelper(20, 20, renderingGridColor, renderingGridColor)}
            position={[0, -1, 0]}
          />)}

        {/* controls for tile and weave */}
        <TitleControls />

        {/* lights */}
        <ambientLight intensity={(renderingLightIntensity - 0.3)} color={'white'} />
        <directionalLight color={'white'} intensity={renderingLightIntensity} position={[20, 20, 0]} />
      </Canvas>

      {/* Button Container */}
      {/* <div id="button-bar-container">
        <button onClick={handleButtonClick}>Button 1</button>
        <button onClick={handleButtonClick}>Button 2</button>
        <button onClick={handleButtonClick}>Button 3</button>
      </div> */}
    </div>

  ) // --- return end
} // --- app function end

export default App
