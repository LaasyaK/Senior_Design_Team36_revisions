import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

// *** Making a curve
class CustomSinCurve extends THREE.Curve {
	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}
	getPoint( t, optionalTarget = new THREE.Vector3() ) {
		const tx = t * 3 - 1.5;
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;
		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

// *** Base ------------------------------------------------------------
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// *** Lights ------------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

const directionalLight = new THREE.DirectionalLight(0x00fff2, 0.6)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

// *** Objects ------------------------------------------------------------
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// thread function for geometry
function createThread(color, radius, length) {
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 32);  // Cylinder geometry for thread
    const threadMaterial = new THREE.MeshStandardMaterial({ color: color });
    threadMaterial.roughness = 0.5
    const cylinder = new THREE.Mesh(geometry, threadMaterial);
    return cylinder;
}

// Create horizontal threads
const threadRadius = 0.1;
const threadLength = 4;
const gap = 0.6;  // Gap between threads
for (let i = -2; i <= 2; i += gap) {
    const horizontalThread = createThread(0xFF0000, threadRadius, threadLength);
    horizontalThread.rotation.z = Math.PI / 2;  // Rotate to lay horizontally
    horizontalThread.position.y = i;  // Move along the y-axis
    scene.add(horizontalThread);
}

// Create vertical threads
for (let i = -3; i <= 3; i += gap) {
    const verticalThread = createThread(0x0000FF, threadRadius, threadLength);
    verticalThread.position.x = i;  // Move along the x-axis
    scene.add(verticalThread);
}

// Objects
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     material
// )
// sphere.position.x = - 1.5

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(0.75, 0.75, 0.75),
//     material
// )

// const torus = new THREE.Mesh(
//     new THREE.TorusGeometry(0.3, 0.2, 32, 64),
//     material
// )
// torus.position.x = 1.5

// yarn noodle
// const path = new CustomSinCurve( 2 );
// const yarn_noodle = new THREE.TubeGeometry( path, 50, 0.5, 15, false );
// const yarn_noodle_mesh = new THREE.Mesh( yarn_noodle, material );

// plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = -2.5
scene.add(plane)

// scene.add(sphere, cube, torus, plane)
// scene.add(yarn_noodle_mesh)

// *** Sizes ------------------------------------------------------------
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

// *** Camera ------------------------------------------------------------
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// *** Renderer ------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// *** Animate ------------------------------------------------------------
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // // Update objects
    // sphere.rotation.y = 0.1 * elapsedTime
    // cube.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.15 * elapsedTime
    // cube.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()