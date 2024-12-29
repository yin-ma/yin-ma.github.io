import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { RNG } from './rng.js';


let renderer, camera, scene, orbit, gui, stats;
let noiseGenerater, rng;
let aspectRatio;
let maxHeight = 30;

const options = {
	size: 40,
	seed: 0,
	helper: false
}

{
	init();
	setupLight();
	setupScence();
	renderer.setAnimationLoop(animate);
}

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);

	aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
	camera.position.set(40, 40, 40);
	camera.lookAt(0, 0, 0);

	orbit = new OrbitControls(camera, renderer.domElement);
	orbit.update();

	scene = new THREE.Scene();
	gui = new GUI();
	rng = new RNG(options.seed);
	noiseGenerater = new SimplexNoise(rng);

	scene.background = getSkyTexture();

	stats = new Stats();
	document.body.appendChild( stats.dom );
	
	const axesHelper = new THREE.AxesHelper(100);
	axesHelper.name = 'axesHelper';
	scene.add(axesHelper);
	axesHelper.visible = false;

	const gridHelper = new THREE.GridHelper(100, 5);
	gridHelper.name = 'gridHelper';
	gridHelper.visible = false;
	scene.add(gridHelper);
}


function getSkyTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	
	const gradient = ctx.createLinearGradient(canvas.width/2, 0, canvas.height/2, canvas.height);
	gradient.addColorStop(0, "skyblue");
	gradient.addColorStop(1, "white");
	
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	return new THREE.CanvasTexture(canvas);
}


function setupLight() {
	const light1 = new THREE.DirectionalLight(new THREE.Color(0.8, 0.8, 0.95), 2.5);	
	light1.position.set(50, 50, 50);
	light1.shadow.camera.bottom = -100;
	light1.shadow.camera.top = 100;
	light1.shadow.camera.left = -100;
	light1.shadow.camera.right = 100;
	light1.shadow.mapSize.width = 1024;
	light1.shadow.mapSize.height = 1024;
	light1.castShadow = true;
	scene.add(light1);
	
	
	const light2 = new THREE.DirectionalLight(new THREE.Color(0.1, 0.4, 0.6), 1.0);
	light2.position.set(-50, 50, -50);
	light2.shadow.camera.bottom = -100;
	light2.shadow.camera.top = 100;
	light2.shadow.camera.left = -100;
	light2.shadow.camera.right = 100;
	light2.shadow.mapSize.width = 1024;
	light2.shadow.mapSize.height = 1024;
	light2.castShadow = true;
	scene.add(light2);
	
	
	const light3 = new THREE.AmbientLight(new THREE.Color('skyblue'), 0.15); 	
	scene.add(light3);
}


function setupScence() {
	let cubes = scene.getObjectByName("cubes");
	if (!cubes) {
		cubes = new THREE.Group();
		cubes.name = "cubes";
		scene.add(cubes);
	} else {
		cubes.clear();
	}

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
	let arr = [];

	for (let x=0; x<options.size; x++) {
		for (let z=0; z<options.size; z++) {
			for (let y=0; y<maxHeight; y++) {
				if ((getNoise(x, z)) < y) continue;
				
				if (isMargin(x, y, z)) {
					arr.push({x: x, y: y, z: z});
				} else if (Math.floor(getNoise(x, z)) === y || Math.floor(getNoise(x, z)) === y+1) {
					arr.push({x: x, y: y, z: z});
				}
			}
		}
	}
	
	let i = 0;
	let matrix = new THREE.Matrix4();
	let temp = new THREE.InstancedMesh(geometry, material, arr.length);
	temp.castShadow = true;
	temp.receiveShadow = true;

	arr.forEach(p => {
		matrix.setPosition(p.x, p.y, p.z);
		temp.setColorAt(i, new THREE.Color(0.1, 0.8*p.y/maxHeight, 0.1));
		temp.setMatrixAt(i, matrix);
		i++;
	})

	cubes.add(temp);
	cubes.position.set(-options.size/2, 0, -options.size/2);
}

function isMargin(x, y, z) {
	if (x === 0 || x === options.size-1 || y === 0 || y === maxHeight-1 || z === 0 || z === options.size-1) return true;
	return false;
}


function getNoise(x, y) {
	return (noiseGenerater.noise(x*0.015, y*0.015)*0.5 + 0.5) * maxHeight;
}


gui.add(options, 'size', 5, 150, 1).onChange(value => setupScence());

gui.add(options, 'seed', 0, 100000, 1).onChange((value) => {
	rng = new RNG(options.seed);
	noiseGenerater = new SimplexNoise(rng);
	setupScence();
})

gui.add(options, 'helper').onChange((value) => {
	const axesHelper = scene.getObjectByName('axesHelper');
	const gridHelper = scene.getObjectByName('gridHelper');
	if (value === true) {
		axesHelper.visible = true;
		gridHelper.visible = true;
	} else {
		axesHelper.visible = false;
		gridHelper.visible = false;
	}
});


function animate(time) {
	renderer.render(scene, camera);
	stats.update();
}

window.addEventListener("resize", () => {
	aspectRatio = window.innerWidth / window.innerHeight;
	camera.aspect = aspectRatio;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	orbit.update();
})



