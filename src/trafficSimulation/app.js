import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { CustomSence } from './customScene.js';
import { CustomCamera } from './customCamera.js';
import config from './config.js';


export class App {
  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new CustomCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene = new CustomSence();
    this.gui = new GUI();
    this.stats = new Stats();
    this.raycaster = new THREE.Raycaster();
    
    this.#init();
  }

  #init() {
    this.renderer.setSize(window.innerWidth, innerHeight);
    this.orbit.update();
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.domElement);

    // window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.orbit.update();
    })

    // setup ray caster
    document.addEventListener('pointerdown', (event) => {
      let mousePos = new THREE.Vector2();
      mousePos.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
      mousePos.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
      this.raycaster.setFromCamera(mousePos, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.ground.children);
      if(intersects.length > 0 ){
        const instanceId = intersects[0].instanceId;
        let x = instanceId % config.mapSize;
        let y = Math.floor(instanceId / config.mapSize);
        intersects[0].object.setColorAt(instanceId, new THREE.Color(0.1, 0.25, 0.1));
        intersects[0].object.instanceColor.needsUpdate = true;
        this.scene.addRoadTile(x, y);
      }
    })
  }

  run() {
    this.renderer.setAnimationLoop((time) => this.#animate(time));
  }

  #animate(time) {
    this.scene.update();
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
  }
  
}