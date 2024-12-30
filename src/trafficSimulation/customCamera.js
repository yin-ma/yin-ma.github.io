import * as THREE from 'three';


export class CustomCamera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.position.set(-10, 10, -10);
    this.lookAt(0, 0, 0);
  }
}