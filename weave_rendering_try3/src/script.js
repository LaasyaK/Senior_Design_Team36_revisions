import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


// --------------------------------------------------------------------------------
// * hard coded input * 
const basicWeave2DArray = [
    [1, 0, 1, 4],   // First row
    [0, 1, 2, 1],   // Second row
    [1, 0, 1, 0],   // Third row
    [0, 1, 0, 1]    // Fourth row
];

// --------------------------------------------------------------------------------
// * weft and warp functions * 
// creating 1 yarn noodle weft
function weft (xPos, zPos, weftMaterial) {
    // array pts -> curve
    const weftCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1*(xPos), 0, zPos),
        new THREE.Vector3(xPos, 0, zPos)
    ]);
    // curve, geometry -> mesh
    const weftMesh = new THREE.Mesh(new THREE.TubeGeometry(weftCurve, 64, 0.1, 20, false), weftMaterial);

    return weftMesh;
}
// creating all of the yarn noodle wefts
function wefts (xPos, spacing, weftNum, weftMaterial, scene) {
    // determining zPos
    let zPos;
    if (weftNum % 2 === 0) {                                    // even weftNum
        zPos = (-1*((weftNum-1)*(spacing/2)));
    }
    else {                                                      // odd weftNum
        zPos = (-1*(((Math.floor(weftNum/2))*spacing)));
    }
    let weftMeshes = [];
    // adding wefts to scene
    for (let i = 0; i < weftNum; i++) {                      
        const weftMesh = weft(xPos, zPos, weftMaterial);
        scene.add(weftMesh);
        weftMeshes.push(weftMesh);
        zPos = zPos + spacing;                                  // incrementing zPos
    }

    return weftMeshes;
}
// creating 1 yarn noodle warp
function warp (row, warpMaterial) {
    let zPosition = -1*((row.length)/2);                    // z pos start
    let warpArrayPoints = [];                               // initializing array to hold all of vec points
    let yPosition = 0;                                      // initializing y pos
    let point;                                              // initializing point for array
    // for each element in the row -> array points
    for (let k = 0; k < row.length; k++) {
        if (row[k]==1) { yPosition = 0.2; }                 // determine the y pos of point
        else { yPosition = -0.2; }
        point = new THREE.Vector3(0, yPosition, zPosition); // put into z pos and y pos
        warpArrayPoints.push(point);                        // put point into array
        zPosition ++;                                       // incrementing z pos for next point
    }
    // array points -> curve
    const warpCurve = new THREE.CatmullRomCurve3(warpArrayPoints);
    // curve, geometry -> mesh
    const warpMesh = new THREE.Mesh(new THREE.TubeGeometry(warpCurve, 64, 0.1, 20, false), warpMaterial);

    return warpMesh;
}
// creating all of the yarn noodle wefts
function warps (array, warpMaterial, scene) {
    // transpose array
    const transposedArray = array[0].map((_, colIndex) => array.map(row => row[colIndex]));
    let warpMesh;                                       // initialize mesh
    let xPosition = -1*((transposedArray.length)/2);    // start of x pos
    // for each row in array
    for (let i = 0; i < transposedArray.length; i++) {
        warpMesh = warp(transposedArray[i], warpMaterial);  // make mesh
        warpMesh.position.x = xPosition;                // change x pos
        scene.add(warpMesh);                            // add to scene
        xPosition++;                                    // increment x pos for next warp
    }
}

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

// adding wefts and warps to scence
let weftMeshes = wefts(3, 1, (basicWeave2DArray.length), horizMaterial, scene);
warps(basicWeave2DArray, vertMaterial, scene);

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