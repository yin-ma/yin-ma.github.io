export class Circle {
  constructor(p5, x, y, radius, mass, color, movable=true, rotatable=true) {
    this.p5 = p5;
    this.type = "circle";
    this.pos = p5.createVector(x, y);
    this.radius = radius;
    this.mass = mass;
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);

    this.ang = 0;
    this.angVel = 0;
    this.angAcc = 0;
    this.inertia = 0.5 * this.mass * this.radius * this.radius;

    this.color = color;
    this.movable = movable;
    this.rotatable = rotatable;

  }

  applyForce(force) {
    if (this.movable) {
      this.acc.x += force.x / this.mass;
      this.acc.y += force.y / this.mass;
    }
  }

  applyTorque(torque) {
    if (this.rotatable) {
      this.angAcc += torque / this.inertia;
    }
  }

  applyImpulse(impulse, norm) {
    let temp = norm.copy();
    this.vel.add(temp.mult(impulse, this.mass));
  }

  update(dt) {
    if (this.movable) {
         
      this.vel.add(mult(this.p5, this.acc, dt));
      this.pos.add(mult(this.p5, this.vel, dt));
  
      this.acc.mult(0);
    }

    if (this.rotatable) {
      this.angVel += this.angAcc * dt;
      this.ang += this.angVel * dt;
      this.angAcc = 0;
    }
  }

  draw() {
    this.p5.fill(this.color);
    this.p5.push();
    this.p5.translate(this.pos.x, this.pos.y);
    this.p5.rotate(this.ang);
    this.p5.circle(0, 0, this.radius * 2);
    this.p5.line(0, 0, 0, this.radius);
    this.p5.pop();
  }
}