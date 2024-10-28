import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const basicWeave2DArray = [
    [1, 0, 1, 1],
    [0, 1, 0, 1],
    [1, 0, 0, 0],
    [0, 1, 0, 1],
];

function ThreeScene() {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Scene, Renderer, Camera, Controls Setup
        const scene = new THREE.Scene();
        const sizes = { width: window.innerWidth, height: window.innerHeight };
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(1, 1, 2);
        scene.add(camera);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0x00fff2, 0.6);
        directionalLight.position.set(1, 0.25, 0);
        scene.add(directionalLight);
        // GUI for Light Control
        const gui = new GUI();
        gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);

        // Materials
        const horizMaterial = new THREE.MeshStandardMaterial({ color: 0x0044FF, roughness: 0.4 });
        const vertMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF44, roughness: 0.4 });

        // Weft Creation Function
        function weft(zPosition, weftMaterial) {
            const weftCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-4, 0, zPosition),
                new THREE.Vector3(4, 0, zPosition),
            ]);
            return new THREE.Mesh(new THREE.TubeGeometry(weftCurve, 64, 0.1, 20, false), weftMaterial);
        }
        // Wefts Creation Function
        function wefts(weftNum, weftMaterial, scene) {
            let zPosition = -(weftNum / 2);
            for (let i = zPosition; i < -zPosition; i++) {
                scene.add(weft(i, weftMaterial));
            }
        }
        // Warp Creation Function
        function warp(row, warpMaterial) {
            const warpPoints = row.map((value, index) => {
                const yPosition = value === 1 ? 0.2 : -0.2;
                return new THREE.Vector3(0, yPosition, index - row.length / 2);
            });
            const warpCurve = new THREE.CatmullRomCurve3(warpPoints);
            return new THREE.Mesh(new THREE.TubeGeometry(warpCurve, 64, 0.1, 20, false), warpMaterial);
        }
        // Warps Creation Function
        function warps(array, warpMaterial, scene) {
            const transposedArray = array[0].map((_, colIndex) => array.map(row => row[colIndex]));
            transposedArray.forEach((row, index) => {
                const warpMesh = warp(row, warpMaterial);
                warpMesh.position.x = index - transposedArray.length / 2;
                scene.add(warpMesh);
            });
        }

        // Add Wefts and Warps to the Scene
        wefts(basicWeave2DArray.length, horizMaterial, scene);
        warps(basicWeave2DArray, vertMaterial, scene);
        // Helpers
        const gridHelper = new THREE.GridHelper(10, 10, 0x800090, 0x090909);
        gridHelper.position.set(0, -1.7, 0);
        scene.add(gridHelper);
        const axesHelper = new THREE.AxesHelper(2);
        axesHelper.position.set(-6, -1, -6);
        scene.add(axesHelper);
        // Plane (ground)
        const planeMaterial = new THREE.MeshStandardMaterial({ roughness: 0.4 });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), planeMaterial);
        plane.rotation.x = -Math.PI * 0.5;
        plane.position.y = -2;
        scene.add(plane);
        // Resize Listener
        const handleResize = () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);
        // Animation Loop
        const clock = new THREE.Clock();
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
        // Cleanup
        return () => {
            gui.destroy();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="webgl" />;
}

export default ThreeScene;
