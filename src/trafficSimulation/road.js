import * as THREE from 'three';

/*
  I - signal road tile
  U - road end
  L - corner
  T - three point road
  X - cross road
*/


const baseColor = new THREE.MeshStandardMaterial({ 
  color: new THREE.Color(68/255, 153/255, 68/255), 
  metalness: 0.1, 
  roughness: 1.0 
});

export class RoadFactory {
  constructor(textureManager) {
    this.textureManager = textureManager;
  }

  getIRoad(x, y) {
    let road = new Road(x, y, this.textureManager.getTextureByName('iroad'));
    road.name = 'iroad';

    let node1 = this.getRoadNode(0.15, 0.15);
    let node2 = this.getRoadNode(0.15, -0.15);
    let node3 = this.getRoadNode(-0.15, -0.15);
    let node4 = this.getRoadNode(-0.15, 0.15);
    road.nodes.add(node1);
    road.nodes.add(node2);
    road.nodes.add(node3);
    road.nodes.add(node4);

    node2.next.push(node1);
    node4.next.push(node3);

    road.right.in = node2;
    road.right.out = node3;
    road.left.in = node4;
    road.left.out = node1;

    return road;
  }

  getURoad(x, y) {
    let road = new Road(x, y, this.textureManager.getTextureByName('uroad'));
    road.name = 'uroad';

    let node1 = this.getRoadNode(0.15, 0.33);
    let node2 = this.getRoadNode(0.15, 0);
    let node3 = this.getRoadNode(-0.15, 0);
    let node4 = this.getRoadNode(-0.15, 0.33);
    
    road.nodes.add(node1);
    road.nodes.add(node2);
    road.nodes.add(node3);
    road.nodes.add(node4);

    node4.next.push(node3);
    node3.next.push(node2);
    node2.next.push(node1);

    road.left.in = node4;
    road.left.out = node1;

    return road;
  }

  getLRoad(x, y) {
    let road = new Road(x, y, this.textureManager.getTextureByName('lroad'));
    road.name = 'lroad';

    let node1 = this.getRoadNode(0.15, 0.15);
    let node2 = this.getRoadNode(0.15, -0.15);
    let node3 = this.getRoadNode(-0.15, -0.15);
    let node4 = this.getRoadNode(-0.15, 0.15);
    road.nodes.add(node1);
    road.nodes.add(node2);
    road.nodes.add(node3);
    road.nodes.add(node4);

    node2.next.push(node1);
    node1.next.push(node4);

    road.right.in = node2;
    road.right.out = node3;
    road.top.in = node3;
    road.top.out = node4;

    return road;
  }

  getTRoad(x, y) {
    let road = new Road(x, y, this.textureManager.getTextureByName('troad'));
    road.name = 'troad';

    let node1 = this.getRoadNode(0.15, 0.15);
    let node2 = this.getRoadNode(0.15, -0.15);
    let node3 = this.getRoadNode(-0.15, -0.15);
    let node4 = this.getRoadNode(-0.15, 0.15);
    road.nodes.add(node1);
    road.nodes.add(node2);
    road.nodes.add(node3);
    road.nodes.add(node4);

    node1.next.push(node4);
    node4.next.push(node3);
    node3.next.push(node2);
    node2.next.push(node1);

    road.bot.in = node1;
    road.bot.out = node2;
    road.right.in = node2;
    road.right.out = node3;
    road.top.in = node3;
    road.top.out = node4;

    return road;
  }

  getXRoad(x, y) {
    let road = new Road(x, y, this.textureManager.getTextureByName('xroad'));
    road.name = 'xroad';

    let node1 = this.getRoadNode(0.15, 0.15);
    let node2 = this.getRoadNode(0.15, -0.15);
    let node3 = this.getRoadNode(-0.15, -0.15);
    let node4 = this.getRoadNode(-0.15, 0.15);
    road.nodes.add(node1);
    road.nodes.add(node2);
    road.nodes.add(node3);
    road.nodes.add(node4);

    node1.next.push(node4);
    node4.next.push(node3);
    node3.next.push(node2);
    node2.next.push(node1);

    road.bot.in = node1;
    road.bot.out = node2;
    road.right.in = node2;
    road.right.out = node3;
    road.top.in = node3;
    road.top.out = node4;
    road.left.in = node3;
    road.left.out = node1;

    return road;
  }

  getRoadNode(x, y) {
    let node = new RoadNode(
      new THREE.BoxGeometry(0.1, 0.1, 0.1), 
      new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.1, roughness:1.0 })
    );
    node.position.x -= x;
    node.position.z -= y;
    return node;
  }
}


export class RoadNode extends THREE.Mesh {
  constructor(geometry, material) {
    super(geometry, material);
    this.name = 'roadnode';
    this.next = [];
  }

  disconnect() {
    this.next = [];
  }

  getRandomNode() {
    if (this.next.length === 0) return null;
    return this.next[RoadNode.randint(0, this.next.length)];
  }

  static randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}


export class Road extends THREE.Group {
  constructor(x, y, material) {
    super();
    this.roadMesh = new THREE.Mesh();
    this.roadMesh.geometry = new THREE.BoxGeometry(1, 0.05, 1);
    this.roadMesh.material = [
      baseColor, 
      baseColor, 
      new THREE.MeshStandardMaterial({ map: material, metalness:0.1, roughness:1.0 }), 
      baseColor, 
      baseColor, 
      baseColor
    ];
    this.roadMesh.receiveShadow = true;
    this.roadMesh.castShadow = true;
    this.add(this.roadMesh);
    this.position.set(x, 0.525, y);
    this.left = {in: null, out: null};
    this.right = {in: null, out: null};
    this.top = {in: null, out: null};
    this.bot = {in: null, out: null};
    this.nodes = new THREE.Group();
    this.edgesMesh = [];
    this.nodes.position.set(x, 1.0, y);
  }

  disconnect() {
    this.left = {in: null, out: null};
    this.right = {in: null, out: null};
    this.top = {in: null, out: null};
    this.bot = {in: null, out: null};
  }

  getRandomNode() {
    let arr = [];
    this.nodes.children.forEach(n => arr.push(n));

    if (arr.length === 0) return null;
    return arr[Road.randint(0, arr.length)];
  }

  rotate(ang) {
    this.rotation.set(0, 0, 0);
    this.rotation.y = ang;

    this.roadMesh.material.forEach(m => {
      if (m !== null) {
        m.needsUpdate = true;
      }
    })

    this.nodes.rotation.set(0, 0, 0);
    this.nodes.rotation.y = ang;

    if (Road.almostEqual(ang, 0)) {
    } else if (Road.almostEqual(ang, Math.PI/2)) {
      let temp = this.left;
      this.left = this.top;
      this.top = this.right;
      this.right = this.bot;
      this.bot = temp;
    } else if (Road.almostEqual(ang, Math.PI)) {
      let temp = this.left;
      this.left = this.right;
      this.right = temp;
      temp = this.top;
      this.top = this.bot;
      this.bot = temp;
    } else if (Road.almostEqual(ang, Math.PI*3/2)) {
      let temp = this.left;
      this.left = this.bot;
      this.bot = this.right;
      this.right = this.top;
      this.top = temp;
    }
  }

  checkRotation(ang) {
    return Road.almostEqual(this.rotation.y, ang);
  }

  static almostEqual(a, b, thethold=0.01) {
    return Math.abs(a-b) < thethold ? true : false;
  }

  static randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

}


export function getIRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const context = canvas.getContext("2d");
  context.fillStyle = "#449944";
  context.fillRect(0, 0, 100, 100);
  context.fillStyle = "#aaaaaa";
  context.fillRect(20, 0, 60, 100);
  context.fillStyle = "#666666";
  context.fillRect(25, 0, 50, 100);

  // debug
  context.fillStyle = "#ff0000";
  context.beginPath();
  context.arc(10, 10, 5, 0, Math.PI*2);
  context.fill();
  
  return new THREE.CanvasTexture(canvas);
}

export function getURoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const context = canvas.getContext("2d");
  context.fillStyle = "#449944";
  context.fillRect(0, 0, 100, 100);
  context.fillStyle = "#aaaaaa";
  context.fillRect(20, 0, 60, 50);
  context.beginPath();
  context.arc(50, 50, 30, 0, Math.PI);
  context.fill();
  context.fillStyle = "#666666";
  context.fillRect(25, 0, 50, 50);
  context.beginPath();
  context.arc(50, 50, 25, 0, Math.PI);
  context.fill();

  // debug
  context.fillStyle = "#ff0000";
  context.beginPath();
  context.arc(10, 10, 5, 0, Math.PI*2);
  context.fill();
  
  return new THREE.CanvasTexture(canvas);
}

export function getLRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const context = canvas.getContext("2d");
  context.fillStyle = "#449944";
  context.fillRect(0, 0, 100, 100);
  context.fillStyle = "#aaaaaa";
  context.fillRect(20, 20, 60, 80);
  context.fillRect(20, 20, 80, 60);
  context.fillStyle = "#666666";
  context.fillRect(25, 25, 50, 80);
  context.fillRect(25, 25, 80, 50);

  // debug
  context.fillStyle = "#ff0000";
  context.beginPath();
  context.arc(10, 10, 5, 0, Math.PI*2);
  context.fill();
  return new THREE.CanvasTexture(canvas);
}

export function getTRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const context = canvas.getContext("2d");
  context.fillStyle = "#449944";
  context.fillRect(0, 0, 100, 100);
  context.fillStyle = "#aaaaaa";
  context.fillRect(20, 20, 60, 80);
  context.fillRect(0, 20, 100, 60);
  context.fillStyle = "#666666";
  context.fillRect(25, 25, 50, 80);
  context.fillRect(0, 25, 100, 50);

  // debug
  context.fillStyle = "#ff0000";
  context.beginPath();
  context.arc(10, 10, 5, 0, Math.PI*2);
  context.fill();
  return new THREE.CanvasTexture(canvas);
}

export function getXRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const context = canvas.getContext("2d");
  context.fillStyle = "#449944";
  context.fillRect(0, 0, 100, 100);
  context.fillStyle = "#aaaaaa";
  context.fillRect(20, 0, 60, 100);
  context.fillRect(0, 20, 100, 60);
  context.fillStyle = "#666666";
  context.fillRect(25, 0, 50, 100);
  context.fillRect(0, 25, 100, 50);

  // debug
  context.fillStyle = "#ff0000";
  context.beginPath();
  context.arc(10, 10, 5, 0, Math.PI*2);
  context.fill();
  return new THREE.CanvasTexture(canvas);
}