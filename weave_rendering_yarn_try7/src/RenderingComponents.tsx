// * Imports *
import React /*, { useMemo, useRef, useEffect } */ from "react";
import * as THREE from "three";
import "./WeaveVisualizationRenderer";

// * wefts functions *
export type WeftProps = {
  weaveArray: boolean[][];
  yPosition: number;
  zPosition: number;
  color: string;
  thickness: number;
  warpSpacing: number;
};
// creates 1 weft
export const Weft: React.FC<
  WeftProps & { pointsRef: React.MutableRefObject<THREE.Vector3[][]> }
> = ({
  weaveArray,
  yPosition,
  zPosition,
  color,
  thickness,
  warpSpacing,
  pointsRef,
}) => {
  const numWarps = weaveArray[0].length;
  const startPosition =
    numWarps % 2 === 0
      ? -1 * ((numWarps - 1) * (warpSpacing / 2))
      : -1 * (Math.floor(numWarps / 2) * warpSpacing);
  const weftCurve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(startPosition - 0.6, yPosition, zPosition), // yarn noodle ends have extra yarn
      new THREE.Vector3(
        startPosition + (numWarps - 1) * warpSpacing + 0.6,
        yPosition,
        zPosition
      ),
    ]);
  }, [weaveArray, yPosition, zPosition, warpSpacing]); // renders weftcurve when these change
  // get start and end end of the path for circles and push into array
  const startPoint = weftCurve.getPoint(0);
  const endPoint = weftCurve.getPoint(1);

  React.useEffect(() => {
    pointsRef.current.push([startPoint, endPoint]);
  }, [
    weaveArray,
    yPosition,
    zPosition,
    thickness,
    warpSpacing,
    pointsRef,
    startPoint,
    endPoint,
  ]);

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
      <mesh position={endPoint} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[thickness, 20]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
};

export type WeftsProps = {
  weaveArray: boolean[][];
  thickness: number;
  weftSpacing: number;
  warpSpacing: number;
  numOfLayers: number;
};
// creates a grouping of wefts
export const Wefts: React.FC<WeftsProps> = ({
  weaveArray,
  thickness,
  weftSpacing,
  warpSpacing,
  numOfLayers,
}) => {
  const numWefts = weaveArray.length;
  const startPosition =
    numWefts % 2 === 0
      ? -1 * ((numWefts - 1) * (weftSpacing / 2))
      : -1 * (Math.floor(numWefts / 2) * weftSpacing);
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
        const zPosition = startPosition + index * weftSpacing; // alters next weft based on spacing
        const yPosition =
          numOfLayers === 1
            ? 0
            : numOfLayers === 2
            ? index % 4
            : numOfLayers === 4
            ? index % 4
            : 0;
        let weftColor;
        if (numOfLayers === 1) {
          weftColor = "#70C1FF";
        } else {
          weftColor =
            index % 4 === 0
              ? "#FF8591"
              : index % 4 === 1
              ? "#9585FF"
              : index % 4 === 2
              ? "#F9B577"
              : index % 4 === 3
              ? "#70C1FF"
              : "#808080";
        }
        // this needs to run every other index (even indexes)
        // if (index % 2 == 0) {
        // const mid = pointsRef[index][1].clone().add(pointsRef[index + 1][1]).multiplyScalar(0.5).add(new THREE.Vector3())
        // const curve = new THREE.CatmullRomCurve3([pointsRef[index][1], pointsRef[index + 1][1]]);
        // }
        // pointsRef[index][1] to get end point of 1st weft and pointsRef[index+1][1] make a curve out of it
        // create a mid point and add to curve
        // with curve make a tubegeometry
        return (
          <Weft
            key={index}
            weaveArray={weaveArray}
            yPosition={yPosition}
            zPosition={zPosition}
            color={weftColor}
            thickness={thickness}
            warpSpacing={warpSpacing}
            pointsRef={pointsRef}
          />
        );
      })}
    </>
  );
};

// * warp functions *
export type WarpProps = {
  weaveArray: boolean[][];
  warpRow: boolean[];
  xPosition: number;
  color: string;
  warpThickness: number;
  weftThickness: number;
  weftSpacing: number;
  layer: number;
  numOfLayers: number;
};
// creates 1 weft
export const Warp: React.FC<WarpProps> = ({
  weaveArray,
  warpRow,
  xPosition,
  color,
  warpThickness,
  weftThickness,
  weftSpacing,
  layer,
  numOfLayers,
}) => {
  const warpCurve = React.useMemo(() => {
    let warpArrayPoints = [];
    const numWefts = weaveArray.length; // determing the start z position
    const startPosition =
      numWefts % 2 === 0
        ? -1 * ((numWefts - 1) * (weftSpacing / 2))
        : -1 * Math.floor(numWefts / 2) * weftSpacing;
    // warp based of num of layers rendering
    const increment =
      numOfLayers === 1 ? 1 : numOfLayers === 2 ? 4 : numOfLayers === 4 ? 4 : 1;
    // 1st 2 warp point outside weft
    warpArrayPoints.push(
      new THREE.Vector3(
        xPosition,
        layer,
        startPosition - 1.6 * (warpThickness + weftThickness)
      )
    );
    warpArrayPoints.push(
      new THREE.Vector3(
        xPosition,
        layer,
        startPosition - 1.4 * (warpThickness + weftThickness)
      )
    );
    for (let i = layer; i < warpRow.length; i = i + increment) {
      const yPosition =
        warpRow[i] === true
          ? weftThickness + warpThickness + layer
          : -1 * weftThickness - warpThickness + layer;
      warpArrayPoints.push(
        new THREE.Vector3(xPosition, yPosition, startPosition + i * weftSpacing)
      );
    }
    // last 2 warp point outside of the warp
    warpArrayPoints.push(
      new THREE.Vector3(
        xPosition,
        layer,
        startPosition +
          (warpRow.length - 1) * weftSpacing +
          1.4 * (warpThickness + weftThickness)
      )
    );
    warpArrayPoints.push(
      new THREE.Vector3(
        xPosition,
        layer,
        startPosition +
          (warpRow.length - 1) * weftSpacing +
          1.6 * (warpThickness + weftThickness)
      )
    );
    return new THREE.CatmullRomCurve3(warpArrayPoints);
  }, [
    weaveArray,
    warpRow,
    xPosition,
    warpThickness,
    weftThickness,
    weftSpacing,
    layer,
    numOfLayers,
  ]);
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
      <mesh position={endPoint}>
        <circleGeometry args={[warpThickness, 20]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
};

export type WarpsProps = {
  weaveArray: boolean[][];
  warpThickness: number;
  weftThickness: number;
  warpspacing: number;
  weftSpacing: number;
  numOfLayers: number;
};
// creates a grouping of warps
export const Warps: React.FC<WarpsProps> = ({
  weaveArray,
  warpThickness,
  warpspacing,
  weftThickness,
  weftSpacing,
  numOfLayers,
}) => {
  const transposedArray = weaveArray[0].map((_, colIndex) =>
    weaveArray.map((row) => row[colIndex])
  );
  const numWarps = weaveArray[0].length;
  const startPosition =
    numWarps % 2 === 0
      ? -1 * ((numWarps - 1) * (warpspacing / 2))
      : -1 * (Math.floor(numWarps / 2) * warpspacing);
  return (
    <>
      {Array.from({ length: transposedArray.length }, (_, index) => {
        const row = transposedArray[index];
        const xPosition = startPosition + index * warpspacing; // alters next warp based on spacing
        const layer =
          numOfLayers === 1
            ? 0
            : numOfLayers === 2
            ? 3 - (index % 4)
            : numOfLayers === 4
            ? 3 - (index % 4)
            : 0;
        let warpColor;
        if (numOfLayers === 1) {
          warpColor = "#0068B8";
        } else {
          warpColor =
            index % 4 === 3
              ? "#B80012"
              : index % 4 === 2
              ? "#3D1FFF"
              : index % 4 === 1
              ? "#C46308"
              : index % 4 === 0
              ? "#0068B8"
              : "#808080";
        }
        return (
          <Warp
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
        );
      })}
    </>
  );
};
