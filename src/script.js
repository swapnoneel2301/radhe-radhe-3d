import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import GUI from 'lil-gui';
import { Vector3 } from 'three';

/**
 * Base
 */

// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const textTexture = textureLoader.load('/textures/matcaps/2.png');
const donutTexture = textureLoader.load('/textures/matcaps/8.png');

textTexture.colorSpace = THREE.SRGBColorSpace;
donutTexture.colorSpace = THREE.SRGBColorSpace;

// all donuts storage
const donutList = [];

// Font Load
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json',(font)=>{
    const textGeometry = new TextGeometry(
        `"Bolo \n Radhe Radhe."`,
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        });
    textGeometry.center();

    const textMaterial = new THREE.MeshMatcapMaterial();
    textMaterial.matcap = textTexture;

    const text = new THREE.Mesh(textGeometry,textMaterial);
    scene.add(text);
    
    camera.lookAt(text.position);

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const donutMaterial = new THREE.MeshMatcapMaterial();
    donutMaterial.matcap = donutTexture;

    for(let i=0; i<100; i++){
        const donut = new THREE.Mesh(donutGeometry,donutMaterial);
        donut.position.x =  (Math.random() - 0.5) * 10;
        donut.position.y =  (Math.random() - 0.5) * 10;
        donut.position.z =  (Math.random() - 0.5) * 10;
        
        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        donut.scale.set(scale,scale,scale);
        // console.log(donut);
        donutList.push(donut);
        console.log(donutList);
        scene.add(donut);
    }

})


/**
 * Object
 */
/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -5
camera.position.y = 2
camera.position.z = 4
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
// const donutMaterial = new THREE.MeshMatcapMaterial();
// donutMaterial.matcap = textTexture;
// const donut = new THREE.Mesh(donutGeometry,donutMaterial);

// scene.add(donut);
/**
 * Animate
 */
const clock = new THREE.Clock()
console.log(donutList);
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Objects
    // donut.rotation.x = elapsedTime;
    // donut.rotation.y = elapsedTime;
    // donut.rotation.z = elapsedTime;
    for(let idx in donutList){
        const donut = donutList[idx];
        const directionX = (idx%2==0) ? -1 : 1;
        const directionY = directionX * -1;

        donut.rotation.x = 8 *  directionX * elapsedTime;
        donut.rotation.y = directionY * elapsedTime;
    }
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()