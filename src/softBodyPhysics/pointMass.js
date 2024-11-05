export class PointMass {
  constructor(p5, x, y, mass, radius, movable=true) {
    this.p5 = p5;
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);
    this.mass = mass;
    this.radius = radius;
    this.movable = movable;
  }

  applyForce(f) {
    this.acc.x += f.x / this.mass;
    this.acc.y += f.y / this.mass;
  }

  update() {
    if (this.movable) {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
    }
    this.acc.mult(0);
  }

  draw() {
    this.p5.fill("red");
    this.p5.circle(this.pos.x, this.pos.y, this.radius);
  }
}