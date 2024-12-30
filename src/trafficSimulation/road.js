import * as THREE from 'three';

/*
  O - signal road tile
  I - straight road
  L - corner
  T - three point road
  X - cross road
*/


export class Road extends THREE.Mesh {
  constructor(x, y) {
    super();

    this.geometry = new THREE.BoxGeometry(1, 0.01, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x333333 });
    this.position.set(x, 0.5005, y);
  }
}


export function getORoadTexture() {
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
  return new THREE.CanvasTexture(canvas);
}

export function getIRoadTexture() {
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
  return new THREE.CanvasTexture(canvas);
}