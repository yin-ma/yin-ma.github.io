import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.set(-4, 4, -4);
camera.lookAt(0, 0, 0);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const scene = new THREE.Scene();
const axisHelper = new THREE.AxesHelper(100);
const gridHelper = new THREE.GridHelper(100, 10);

scene.add(axisHelper);
scene.add(gridHelper);

const gui = new GUI();
const stats = new Stats();
document.body.appendChild(stats.domElement);


renderer.setAnimationLoop(animate);

function animate(time) {
  stats.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  aspectRatio = window.innerWidth / window.innerHeight;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  orbit.update();
})