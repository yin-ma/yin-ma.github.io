import { Circle } from "./circle.js";
import { Rect } from "./rect.js";


export class World {
  constructor(p5) {
    this.p5 = p5;
    this.gravity = this.p5.createVector(0, -10);
    this.objects = [];
    this.deltaTime = 1;
  }

  handleClick() {
    if (!this.p5.mouseIsPressed) return;

    let r = Math.random();
    let col = this.p5.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
    if (r < 0.5) {
      let d = randomInt(10, 25);
      let temp = new Circle(this.p5, this.p5.mouseX - this.p5.width/2, -this.p5.mouseY + this.p5.height, d, d, col, true);
      temp.applyTorque(randomInt(-100, 100));
      temp.applyForce(this.p5.createVector(randomInt(-100, 100), randomInt(10, 200)));
      this.add(temp);
    } else {
      let w = randomInt(10, 25);
      let h = randomInt(10, 25);
      let temp = new Rect(this.p5, this.p5.mouseX - this.p5.width/2, -this.p5.mouseY + this.p5.height, w, h, Math.max(r, h), col, true);
      temp.applyTorque(randomInt(-100, 100));
      temp.applyForce(this.p5.createVector(randomInt(-100, 100), randomInt(10, 200)));
      this.add(temp);
    }
  }

  add(object) {
    this.objects.push(object);
  }

  update() {
    this.objects.forEach(obj => {
      obj.applyForce(this.gravity);
    })

    this.objects.forEach(obj => {
      obj.update(this.deltaTime);
    })

    for (let i=0; i<this.objects.length; i++) {
      for (let j=0; j<this.objects.length; j++) {
        if (i === j) continue;
        this.resolveCollision(this.objects[i], this.objects[j]);
      }
    }
  }

  resolveCollision(obj1, obj2) {

  }

  draw() {
    this.p5.translate(this.p5.width/2, this.p5.height);
    this.p5.scale(1, -1);

    this.objects.forEach(obj => {
      obj.draw();
    })
  }
}