import * as THREE from 'three';


export class CarFactory {
  constructor() {

  }

  
  static getCar() {
    let car = new Car();

    car.position.y = 0.55;
    car.scale.set(0.0045, 0.0045, 0.0045);

    return car;
  }
}


export class Car extends THREE.Group {
  constructor() {
    super();
    this.destination = null;
    this.name = 'car';
    this.velocity = 0.01;
    this.init();
  }

  init() {
    const main = new THREE.Mesh(new THREE.BoxGeometry(60, 15, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) }));
    main.position.y = 12;
    this.add(main);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(40, 12, 24), new THREE.MeshBasicMaterial({ color: 0x222222 }));
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    this.add(cabin);

    const backWheel = new THREE.Mesh(new THREE.BoxGeometry(12, 12, 36), new THREE.MeshLambertMaterial({ color: 0x222222 }));
    backWheel.position.y = 6;
    backWheel.position.x = -18;
    this.add(backWheel);
  
    const frontWheel = new THREE.Mesh(new THREE.BoxGeometry(12, 12, 36), new THREE.MeshLambertMaterial({ color: 0x222222 }));
    frontWheel.position.y = 6;
    frontWheel.position.x = 18;
    this.add(frontWheel);
  }

  setOrientation() {
    if (!this.destination) return;
    let position = new THREE.Vector3();
    let target = this.destination.getWorldPosition(position);
    target.y = 0.55;
    this.lookAt(position);
    this.rotateY(Math.PI*3/2);
  }

  update() {
    if (!this.destination) {
      return;
    }
    let targetPosition = new THREE.Vector3();
    this.destination.getWorldPosition(targetPosition);
    targetPosition.y = 0.55;
    let currPosition = new THREE.Vector3();
    this.getWorldPosition(currPosition);

    if (currPosition.distanceTo(targetPosition) < 0.01) {
      this.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      this.destination = this.destination.getRandomNode();
      if (!this.destination) return;
      this.setOrientation();
      return;
    }

    let dir = targetPosition.sub(currPosition).normalize();
    this.position.x += this.velocity * dir.x;
    this.position.z += this.velocity * dir.z;

  }
}