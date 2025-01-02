import * as THREE from 'three';
import config from './config.js';
import { getURoadTexture, getLRoadTexture, getIRoadTexture, getTRoadTexture, getXRoadTexture, RoadFactory, Road } from './road.js';
import { CarFactory } from './car.js';
import { TextureManager } from './TextureManager.js';


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

    this.carCount = 0;
    this.roadCount = 0;
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

  addNewCar() {
    let car = CarFactory.getCar();
    this.add(car);

    let node = this.road.children[Road.randint(0, this.road.children.length)].getRandomNode();
    let nodePosition = new THREE.Vector3();
    node.getWorldPosition(nodePosition);
    car.position.x = nodePosition.x;
    car.position.z = nodePosition.z;

    car.destination = node.next[Road.randint(0, node.next.length)];
    car.setOrientation();
  }

  addRoadTile(x, y) {
    if (this.sceneData[x][y] !== null) {
      return;
    }

    this.roadCount += 1;

    // place a block
    let road = this.roadFactory.getIRoad(x, y);
    this.sceneData[x][y] = road;
    this.road.add(road);

    // renew the block and its neighbour
    this.removeConnection(x, y); // mid
    this.removeConnection(x, y-1); // left
    this.removeConnection(x, y+1); // right
    this.removeConnection(x+1, y); // top
    this.removeConnection(x-1, y); // bot

    this.renewTile(x, y); // mid
    this.renewTile(x, y-1); // left
    this.renewTile(x, y+1); // right
    this.renewTile(x+1, y); // top
    this.renewTile(x-1, y); // bot

    //this.renewConnection(x, y); // mid
    this.renewConnection(x, y-1); //left
    this.renewConnection(x, y+1); // right
    this.renewConnection(x+1, y); // top
    this.renewConnection(x-1, y); // bot

    this.addConnectionMesh(x, y);
    this.addConnectionMesh(x, y-1);
    this.addConnectionMesh(x, y+1);
    this.addConnectionMesh(x+1, y);
    this.addConnectionMesh(x-1, y);
  }

  removeConnection(x, y) {
    let left = this.getTile(x, y-1);
    let right = this.getTile(x, y+1);
    let top = this.getTile(x+1, y);
    let bot = this.getTile(x-1, y);
    let curr = this.getTile(x, y);

    if (left && curr && left.right.out && curr.left.in) {
      left.right.out.next = left.right.out.next.filter(node => {
        if (node.uuid === curr.left.in.uuid) return false;
        return true;
      })

      left.edgesMesh.forEach(mesh => {
        this.roadHelper.remove(mesh)
      })

      left.edgesMesh = [];
      this.addConnectionMesh(x, y-1);
    }

    if (right && curr && right.left.out && curr.right.in) {
      right.left.out.next = right.left.out.next.filter(node => {
        if (node.uuid === curr.right.in.uuid) return false;
        return true;
      })

      right.edgesMesh.forEach(mesh => {
        this.roadHelper.remove(mesh)
      })

      right.edgesMesh = [];
      this.addConnectionMesh(x, y+1);
    }

    if (top && curr && top.bot.out && curr.top.in) {
      top.bot.out.next = top.bot.out.next.filter(node => {
        if (node.uuid === curr.top.in.uuid) return false;
        return true;
      })

      top.edgesMesh.forEach(mesh => {
        this.roadHelper.remove(mesh)
      })

      top.edgesMesh = [];
      this.addConnectionMesh(x+1, y);
    }

    if (bot && curr && bot.top.out && curr.bot.in) {
      bot.top.out.next = bot.top.out.next.filter(node => {
        if (node.uuid === curr.bot.in.uuid) return false;
        return true;
      })

      bot.edgesMesh.forEach(mesh => {
        this.roadHelper.remove(mesh)
      })

      bot.edgesMesh = [];
      this.addConnectionMesh(x-1, y);
    }

    
    if (curr) {
      curr.edgesMesh.forEach(cone => {
        this.roadHelper.remove(cone);
      })

      curr.edgesMesh = [];
    }

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
    this.roadHelper.add(this.sceneData[x][y].nodes);
  }

  renewConnection(x, y) {
    let curr = this.getTile(x, y);
    if (!curr) return;
    let left = this.getTile(x, y-1);
    let right = this.getTile(x, y+1);
    let top = this.getTile(x+1, y);
    let bot = this.getTile(x-1, y);

    // connect road blocks
    if (left) {
      curr.left.out.next.push(left.right.in);
      left.right.out.next.push(curr.left.in);
      this.addConnectionMesh(x, y-1);
    }
    if (right) {
      curr.right.out.next.push(right.left.in);
      right.left.out.next.push(curr.right.in);
      this.addConnectionMesh(x, y+1);
    }
    if (top) {
      curr.top.out.next.push(top.bot.in);
      top.bot.out.next.push(curr.top.in);
      this.addConnectionMesh(x+1, y);
    }
    if (bot) {
      curr.bot.out.next.push(bot.top.in);
      bot.top.out.next.push(curr.bot.in);
      this.addConnectionMesh(x-1, y);
    }
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
        cone.name = 'cone';

        let axis = nextNodePosition.clone().sub(nodePosition).normalize();
        let quaternion = new THREE.Quaternion();

        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
        cone.quaternion.copy(quaternion);
        cone.position.set((nodePosition.x + nextNodePosition.x) / 2, (nodePosition.y + nextNodePosition.y) / 2, (nodePosition.z + nextNodePosition.z) / 2);

        this.roadHelper.add(cone);
        this.roadHelperMesh[x][y].push(cone);
        this.sceneData[x][y].edgesMesh.push(cone);
      })
    })
  }

  removeRoadTile(x, y) {
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

    this.road.remove(this.sceneData[x][y]);
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
    this.children.forEach(c => {
      if (typeof c.update === 'function') {
        c.update();

        if (!c.destination) {
          this.remove(c);
        }
      }
    })

    // handle the population of cars.
    if (this.roadCount < 4) {
      if (this.carCount !== this.roadCount) {
        this.addNewCar();
        this.carCount += 1;
      }
    } else {
      if (this.roadCount * 0.5 > this.carCount) {
        this.addNewCar();
        this.carCount += 1;
      }
    }
  }
}