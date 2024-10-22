import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


// --------------------------------------------------------------------------------
// * hard coded input * 
const basicWeave2DArray = [
    [1, 0, 1],   // First row
    [0, 1, 0],   // Second row
    [1, 0, 1]    // Third row
];

// --------------------------------------------------------------------------------
// * classes * 
// class for the weft noodle
class weft {
    constructor (arrayInput, zPos, weftMaterial) {
        this.arrayInput = arrayInput;
        this.zPos = zPos;
        this.weftMaterial = weftMaterial;
    }
    // method to create the weft noodle mesh
    creatingWeftNoodleMesh () {
        const xPos = ((this.arrayInput[0].length)+0.2)/2;   // start xPos at num of warps + 0.2
        const weftCurve = new THREE.CatmullRomCurve3([      // array points -> curve
            new THREE.Vector3(-1*(xPos), 0, this.zPos),
            new THREE.Vector3(xPos, 0, this.zPos)
        ]);
        // curve, geometry -> mesh
        const weftMesh = new THREE.Mesh(
            new THREE.TubeGeometry(weftCurve, 64, 0.1, 20, false), 
            this.weftMaterial);
        return weftMesh;                                    // return created weft noodle mesh
    }
}
// class for creating group of weft noodles
class wefts {
    constructor (arrayInput, spacing, weftMaterial, scene) {
        this.arrayInput = arrayInput;
        this.spacing = spacing;
        this.weftMaterial = weftMaterial;
        this.scene = scene;
    }
    // method to add group of weft meshes to scene
    addingWeftsToScene () {
        let weftNum = this.arrayInput.length;               // get number of wefts from input array
        let zPos;
        if (weftNum % 2 === 0) { zPos = (-1*((weftNum-1)*(this.spacing/2))); }   // zPos for even number of weft noodles
        else { zPos = (-1*(((Math.floor(weftNum/2))*this.spacing))); }           // zPos for odd number of weft noodles
        let weftZpos = [];                                  // store all weft z positions
        for (let i = 0; i < weftNum; i++) {                 // adding weft meshes from weft class to scene                    
            const newWeft = new weft(this.arrayInput, zPos, this.weftMaterial); // making weft instance
            const weftMesh = newWeft.creatingWeftNoodleMesh();                  // getting weft noodle Mesh from method
            this.scene.add(weftMesh);                       // adding weft noodle mesh
            weftZpos.push(zPos);                            // store each zPos of created weft to scene
            zPos = zPos + this.spacing;                     // incrementing zPos by spacing
        }
    }
    // method to get all of the zPos of the wefts
    // getWeftsZPos() {

    // }
}
// class for the warp noodle
// class warp {
//     constructor (warpRow, warpMaterial) {
//         this.warpRow = warpRow;
//         this. warpMaterial - warpMaterial;
//     }
//     // method to create warp noodle mesh
//     creatingWarpNoodleMesh () {
//         // let weftNum = arrayInput.length;   //TODO arrayInout param                     // get number of wefts from array
//         // determining zPos of wefts
//         // let zPos;
//         // // even number of weft noodles
//         // if (weftNum % 2 === 0) { zPos = (-1*((weftNum-1)*(spacing/2))); } 
//         // // odd number of weft noodles
//         // else { zPos = (-1*(((Math.floor(weftNum/2))*spacing))); }
        
//         // make array points depending on wefts pos
//             // zpos = starts at start zpos of weft
//                 // increments where the next weft is



//         let zPosition = -1*((warpRow.length)/2);                // z pos start
//         let warpArrayPoints = [];                               // initializing array to hold all of vec points
//         let yPos = 0;                                           // initializing y pos
//         let point;                                              // initializing point for array
//         // for each element in the row -> array points
//         for (let k = 0; k < warpRow.length; k++) {
//             if (warpRow[k]==1) { yPos = 0.2; }                  // determine the y pos of point
//             else { yPos = -0.2; }
//             point = new THREE.Vector3(0, yPos, zPosition);      // put into z pos and y pos
//             warpArrayPoints.push(point);                        // put point into array
//             zPosition ++;                                       // incrementing z pos for next point
//         }
//         // array points -> curve
//         const warpCurve = new THREE.CatmullRomCurve3(warpArrayPoints);
//         // curve, geometry -> mesh
//         const warpMesh = new THREE.Mesh(new THREE.TubeGeometry(warpCurve, 64, 0.1, 20, false), warpMaterial);

//         return warpMesh;
//     }
// }

// --------------------------------------------------------------------------------
// * weft and warp functions * 
// creating 1 yarn noodle weft
// function weft (arrayInput, zPos, weftMaterial) {
//     // xPos start at number of warps + 0.2
//     const xPos = ((arrayInput[0].length)+0.2)/2;
//     // array pts -> curve
//     const weftCurve = new THREE.CatmullRomCurve3([
//         new THREE.Vector3(-1*(xPos), 0, zPos),
//         new THREE.Vector3(xPos, 0, zPos)
//     ]);
//     // curve, geometry -> mesh
//     const weftMesh = new THREE.Mesh(new THREE.TubeGeometry(weftCurve, 64, 0.1, 20, false), weftMaterial);
//     return weftMesh;
// }
// // creating all of the yarn noodle wefts
// function wefts (arrayInput, spacing, weftMaterial, scene) {
//     let weftNum = arrayInput.length;                        // get number of wefts from array
//     // determining start zPos of wefts
//     let zPos;
//     // even number of weft noodles
//     if (weftNum % 2 === 0) { zPos = (-1*((weftNum-1)*(spacing/2))); } 
//     // odd number of weft noodles
//     else { zPos = (-1*(((Math.floor(weftNum/2))*spacing))); }
//     let weftMeshes = [];
//     // adding wefts to scene
//     for (let i = 0; i < weftNum; i++) {                      
//         const weftMesh = weft(arrayInput, zPos, weftMaterial);
//         scene.add(weftMesh);
//         weftMeshes.push(weftMesh);
//         zPos = zPos + spacing;                              // incrementing zPos
//     }
//     return weftMeshes;
// }
// // creating 1 yarn noodle warp
// function warp (warpRow, warpMaterial) {
//     // let weftNum = arrayInput.length;   //TODO arrayInout param                     // get number of wefts from array
//     // determining zPos of wefts
//     // let zPos;
//     // // even number of weft noodles
//     // if (weftNum % 2 === 0) { zPos = (-1*((weftNum-1)*(spacing/2))); } 
//     // // odd number of weft noodles
//     // else { zPos = (-1*(((Math.floor(weftNum/2))*spacing))); }
    
//     // make array points depending on wefts pos
//         // zpos = starts at start zpos of weft
//             // increments where the next weft is



//     let zPosition = -1*((warpRow.length)/2);                // z pos start
//     let warpArrayPoints = [];                               // initializing array to hold all of vec points
//     let yPos = 0;                                           // initializing y pos
//     let point;                                              // initializing point for array
//     // for each element in the row -> array points
//     for (let k = 0; k < warpRow.length; k++) {
//         if (warpRow[k]==1) { yPos = 0.2; }                  // determine the y pos of point
//         else { yPos = -0.2; }
//         point = new THREE.Vector3(0, yPos, zPosition);      // put into z pos and y pos
//         warpArrayPoints.push(point);                        // put point into array
//         zPosition ++;                                       // incrementing z pos for next point
//     }
//     // array points -> curve
//     const warpCurve = new THREE.CatmullRomCurve3(warpArrayPoints);
//     // curve, geometry -> mesh
//     const warpMesh = new THREE.Mesh(new THREE.TubeGeometry(warpCurve, 64, 0.1, 20, false), warpMaterial);

//     return warpMesh;
// }
// // creating all of the yarn noodle wefts
// function warps (array, spacing, warpMaterial, scene) {
//     // transpose array
//     const transposedArray = array[0].map((_, colIndex) => array.map(row => row[colIndex]));
//     // determining xPos
//     let xPos;
//     if (transposedArray.length % 2 === 0) {                 // even warps
//         xPos = (-1*((transposedArray.length-1)*(spacing/2)));
//     }
//     else {                                                  // odd warps
//         xPos = (-1*(((Math.floor(transposedArray.length/2))*spacing)));
//     }
//     let warpMesh;                                           // initialize mesh
//     let warpMeshes = [];
//     // for each row in array, each warp
//     for (let i = 0; i < transposedArray.length; i++) {
//         warpMesh = warp(transposedArray[i], warpMaterial);  // make mesh
//         warpMesh.position.x = xPos;                         // change x pos
//         scene.add(warpMesh);                                // add to scene
//         xPos = xPos + spacing;                              // increment x pos for next warp
//         warpMeshes.push(warpMesh);
//     }

//     return warpMeshes;
// }
// // creates the wefts and warps
// function weave (arrayInput, spacing, weftMaterial, warpMaterial, scene) {
//     // create the weft and warp meshes
//     let weftMeshes = wefts(arrayInput, spacing, weftMaterial, scene);
//     let warpMeshes = warps(arrayInput, spacing, warpMaterial, scene);

//     // have the weftMeshe edges and warpMeshes edges matches in in rect prism
//     // create it at the orign
// }

// --------------------------------------------------------------------------------
// * base * 
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// --------------------------------------------------------------------------------
// * lights * 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

const directionalLight = new THREE.DirectionalLight(0x00fff2, 0.6)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

// --------------------------------------------------------------------------------
// * grid and axis * 
const gridHelper = new THREE.GridHelper( 10, 10, 0x800090 , 0x090909 );
gridHelper.position.set(0, -0.5, 0);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(2);  // 5 is the length of the axes
axesHelper.position.set(-6, 0, -6);  // Move the axes to the side along the X-axis
scene.add(axesHelper);

// --------------------------------------------------------------------------------
// * objects * 
// Material
const planeMaterial = new THREE.MeshStandardMaterial()
planeMaterial.roughness = 0.4
const vertMaterial = new THREE.MeshStandardMaterial({color: 0x00FF44})
vertMaterial.roughness = 0.4
const horizMaterial = new THREE.MeshStandardMaterial({color: 0x0044FF})
horizMaterial.roughness = 0.4

// using class to create weft group
let weftsGroup = new wefts(basicWeave2DArray, 1, horizMaterial, scene);
weftsGroup.addingWeftsToScene();

// // adding wefts and warps to scene
// weave (
//     basicWeave2DArray, 1, 
//     horizMaterial, vertMaterial, scene);

// plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), planeMaterial)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = -0.6
scene.add(plane)

// --------------------------------------------------------------------------------
// * sizes * 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// --------------------------------------------------------------------------------
// * camera * 
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// --------------------------------------------------------------------------------
// * renderer * 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// --------------------------------------------------------------------------------
// * animate * 
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update controls
    controls.update()
    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()