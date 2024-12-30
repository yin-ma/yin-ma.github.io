import * as THREE from 'three';
import config from './config.js';
import { TextureManager } from './TextureManager.js';
import { getIRoadTexture, getLRoadTexture, getORoadTexture, getTRoadTexture, getXRoadTexture, Road } from './road.js';


export class CustomSence extends THREE.Scene {
  constructor() {
    super();

    this.sceneData = new Array(config.mapSize).fill(null).map(r => new Array(config.mapSize).fill(null));
    this.axisHelper = new THREE.AxesHelper(10);
    this.gridHelper = new THREE.GridHelper(10, 10);
    this.ground = new THREE.Group();
    this.road = new THREE.Group();
    this.add(this.ground);
    this.add(this.road);

    this.textureManager = new TextureManager();
    this.#init();
  }

  #init() {
    this.add(this.axisHelper);
    this.add(this.gridHelper);

    // add ground instance
    let mat4 = new THREE.Matrix4();
    const groundMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }), config.mapSize*config.mapSize);
    groundMesh.name = 'ground';
    let count = 0;
    for (let y=0; y<config.mapSize; y++) {
      for (let x=0; x<config.mapSize; x++) {
        mat4.setPosition(new THREE.Vector3(x, 0 , y));
        groundMesh.setMatrixAt(count, mat4);
        groundMesh.setColorAt(count, new THREE.Color(0.15, 0.35, 0.15));
        count++;
      }
    }
    this.ground.add(groundMesh);

    // init texture for later use
    this.textureManager.addTextureByName('oroad', getORoadTexture());
    this.textureManager.addTextureByName('iroad', getIRoadTexture());
    this.textureManager.addTextureByName('lroad', getLRoadTexture());
    this.textureManager.addTextureByName('troad', getTRoadTexture());
    this.textureManager.addTextureByName('xroad', getXRoadTexture());
  }

  addRoadTile(x, y) {
    // TODO: change logic that add road
    let road = new Road(x, y);
    this.sceneData[x][y] = road;
    this.road.add(road);

    let rand = Math.random();

    if (rand < 0.2) {
      road.material = new THREE.MeshBasicMaterial({ map: this.textureManager.getTextureByName('oroad') });
    } else if (rand < 0.4) {
      road.material = new THREE.MeshBasicMaterial({ map: this.textureManager.getTextureByName('iroad') });
    } else if (rand < 0.6) {
      road.material = new THREE.MeshBasicMaterial({ map: this.textureManager.getTextureByName('lroad') });
    } else if (rand < 0.8) {
      road.material = new THREE.MeshBasicMaterial({ map: this.textureManager.getTextureByName('troad') });
    } else {
      road.material = new THREE.MeshBasicMaterial({ map: this.textureManager.getTextureByName('xroad') });
    }
  }

  update() {

  }
}