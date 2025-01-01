import * as THREE from 'three';
import config from './config.js';
import { TextureManager } from './TextureManager.js';
import { getURoadTexture, getLRoadTexture, getIRoadTexture, getTRoadTexture, getXRoadTexture, RoadFactory } from './road.js';


export class CustomSence extends THREE.Scene {
  constructor() {
    super();

    this.sceneData = new Array(config.mapSize).fill(null).map(r => new Array(config.mapSize).fill(null));
    this.axisHelper = new THREE.AxesHelper(10);
    this.gridHelper = new THREE.GridHelper(10, 10);
    this.ground = new THREE.Group();
    this.road = new THREE.Group();
    this.roadHelper = new THREE.Group();
    this.textureManager = new TextureManager();
    this.roadFactory = new RoadFactory(this.textureManager);
    this.roadHelperMesh = new Array(config.mapSize).fill(null).map(r => new Array(config.mapSize).fill([]));
    this.#init();

    this.t = 0;

  }

  #init() {
    this.add(this.ground);
    this.add(this.road);
    this.add(this.axisHelper);
    this.add(this.gridHelper);
    this.add(this.roadHelper);

    // add ground instance
    let mat4 = new THREE.Matrix4();
    const groundMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }), config.mapSize*config.mapSize);
    groundMesh.name = 'ground';
    let count = 0;
    for (let y=0; y<config.mapSize; y++) {
      for (let x=0; x<config.mapSize; x++) {
        mat4.setPosition(new THREE.Vector3(x, 0 , y));
        groundMesh.setMatrixAt(count, mat4);
        groundMesh.setColorAt(count, new THREE.Color(68/255, 153/255, 68/255));
        count++;
      }
    }
    this.ground.add(groundMesh);

    // init texture for later use
    this.textureManager.addTextureByName('iroad', getIRoadTexture());
    this.textureManager.addTextureByName('uroad', getURoadTexture());
    this.textureManager.addTextureByName('lroad', getLRoadTexture());
    this.textureManager.addTextureByName('troad', getTRoadTexture());
    this.textureManager.addTextureByName('xroad', getXRoadTexture());
  }

  addRoadTile(x, y) {
    if (this.sceneData[x][y] !== null) {
      // console.log(this.sceneData[x][y]);
      // this.removeRoadTile(x, y);
      // let temp = this.roadFactory.getTRoad(x, y);
      // this.sceneData[x][y] = temp;
      // this.road.add(temp);
      // this.roadHelper.add(this.sceneData[x][y].nodes);
      return;
    }

    // place a block
    let road = this.roadFactory.getIRoad(x, y);
    this.sceneData[x][y] = road;
    this.road.add(road);

    // renew the block and its neighbour
    this.renewTile(x, y); // mid
    this.renewTile(x, y-1); // left
    this.renewTile(x, y+1); // right
    this.renewTile(x+1, y); // top
    this.renewTile(x-1, y); // bot

    this.renewConnection(x, y);
    this.renewConnection(x, y-1);
    this.renewConnection(x, y+1);
    this.renewConnection(x+1, y);
    this.renewConnection(x-1, y);
  }

  renewTile(x, y) {
    if (x < 0 || x >= config.mapSize || y < 0 || y >= config.mapSize) return;
    if (this.sceneData[x][y] === null) return;
    this.removeRoadTile(x, y);

    let left = this.hasTile(x, y-1);
    let right = this.hasTile(x, y+1);
    let top = this.hasTile(x+1, y);
    let bot = this.hasTile(x-1, y);
    let road;

    if (!left && !right && !top && !bot) {
      road = this.roadFactory.getIRoad(x, y);
    } else if (left && !right && !top && !bot) {
      road = this.roadFactory.getURoad(x, y);
    } else if (!left && right && !top && !bot) {
      road = this.roadFactory.getURoad(x, y);
      road.rotate(Math.PI);
    } else if (!left && !right && top && !bot) {
      road = this.roadFactory.getURoad(x, y);
      road.rotate(Math.PI*3/2);
    } else if (!left && !right && !top && bot) {
      road = this.roadFactory.getURoad(x, y);
      road.rotate(Math.PI/2);
    } else if (left && right && !top && !bot) {
      road = this.roadFactory.getIRoad(x, y);
    } else if (left && !right && top && !bot) {
      road = this.roadFactory.getLRoad(x, y);
      road.rotate(Math.PI/2);
    } else if (left && !right && !top && bot) {
      road = this.roadFactory.getLRoad(x, y);
      road.rotate(Math.PI);
    } else if (!left && right && top && !bot) {
      road = this.roadFactory.getLRoad(x, y);
    } else if (!left && right && !top && bot) {
      road = this.roadFactory.getLRoad(x, y);
      road.rotate(Math.PI*3/2);
    } else if (!left && !right && top && bot) {
      road = this.roadFactory.getIRoad(x, y);
      road.rotate(Math.PI/2);
    } else if (left && right && top && !bot) {
      road = this.roadFactory.getTRoad(x, y);
      road.rotate(Math.PI/2);
    } else if (!left && right && top && bot) {
      road = this.roadFactory.getTRoad(x, y);
    } else if (left && right && !top && bot) {
      road = this.roadFactory.getTRoad(x, y);
      road.rotate(Math.PI*3/2);
    } else if (left && !right && top && bot) {
      road = this.roadFactory.getTRoad(x, y);
      road.rotate(Math.PI);
    } else if (left && right && top && bot) {
      road = this.roadFactory.getXRoad(x, y); 
    }

    this.sceneData[x][y] = road;
    this.road.add(road);

    // add note to helepr
    this.roadHelper.add(this.sceneData[x][y].nodes);
  }

  renewConnection(x, y) {
    if (!this.hasTile(x, y)) return;

    let left = this.hasTile(x, y-1);
    let right = this.hasTile(x, y+1);
    let top = this.hasTile(x+1, y);
    let bot = this.hasTile(x-1, y);
    // connect road blocks
    let road = this.sceneData[x][y];
    if (left) {
      let leftRoad = this.getTile(x, y-1);
      leftRoad.right.out.next.push(road.left.in);
      road.left.out.next.push(leftRoad.right.in);
      this.addConnectionMesh(x, y-1);
    }
    if (right) {
      let rightRoad = this.getTile(x, y+1);
      road.right.out.next.push(rightRoad.left.in);
      rightRoad.left.out.next.push(road.right.in);
      this.addConnectionMesh(x, y+1);
    }
    if (top) {
      let topRoad = this.getTile(x+1, y);
      road.top.out.next.push(topRoad.bot.in);
      topRoad.bot.out.next.push(road.top.in);
      this.addConnectionMesh(x+1, y);
    }
    if (bot) {
      let botRoad = this.getTile(x-1, y);
      road.bot.out.next.push(botRoad.top.in);
      botRoad.top.out.next.push(road.bot.in);
      this.addConnectionMesh(x-1, y);
    }
    this.addConnectionMesh(x, y);
  }

  addConnectionMesh(x, y) {
    if (!this.hasTile(x, y)) return;
    this.sceneData[x][y].nodes.children.forEach(node => {
      let nodePosition = new THREE.Vector3();
      node.getWorldPosition(nodePosition);
      node.next.forEach(nextNode => {
        let nextNodePosition = new THREE.Vector3();
        nextNode.getWorldPosition(nextNodePosition);

        let coneGeo = new THREE.ConeGeometry(0.03, nodePosition.distanceTo(nextNodePosition)-0.1, 7);
        let coneMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        let cone = new THREE.Mesh(coneGeo, coneMat);

        let axis = nextNodePosition.clone().sub(nodePosition).normalize();
        let quaternion = new THREE.Quaternion();

        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
        cone.quaternion.copy(quaternion);
        cone.position.set((nodePosition.x + nextNodePosition.x) / 2, (nodePosition.y + nextNodePosition.y) / 2, (nodePosition.z + nextNodePosition.z) / 2);

        this.roadHelper.add(cone);

        this.roadHelperMesh[x][y].push(cone);
      })
    })
  }

  removeRoadTile(x, y) {
    this.road.remove(this.sceneData[x][y]);

    this.roadHelper.remove(this.sceneData[x][y].nodes);
    this.roadHelperMesh[x][y].forEach(m => {
      this.roadHelper.remove(m);
      m.geometry.dispose();
      m.material.dispose();
    })

    this.sceneData[x][y].nodes.traverse(child => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    })

    this.sceneData[x][y].traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.forEach(m => {
          if (m !== null) {
            m.dispose()
          }
        });
      }
    });
    this.sceneData[x][y] = null;
    this.roadHelperMesh[x][y] = [];
  }

  countNeighbor(x, y) {
    let left = this.hasTile(x, y-1);
    let right = this.hasTile(x, y+1);
    let top = this.hasTile(x+1, y);
    let bot = this.hasTile(x-1, y);

    return left + right + top + bot;
  }

  getTile(x, y) {
    if (x < 0 || x >= config.mapSize || y < 0 || y >= config.mapSize) return;
    return this.sceneData[x][y];
  }

  hasTile(x, y) {
    if (x < 0 || x >= config.mapSize || y < 0 || y >= config.mapSize) return false;
    if (this.sceneData[x][y] === null) return false;
    return true;
  }

  update() {
    // if (this.sceneData[1][1] === null) return;

    // this.sceneData[1][1].nodes.children.forEach(c => {
    //   c.rotation.set(0, 0, 0);
    //   c.rotation.y = this.t;
    // })
    // this.t += 0.01;
  }
}