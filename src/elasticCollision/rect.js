export class Rect {
  constructor(p5, x, y, width, height, mass, color, movable=true) {
    this.p5 = p5;
    this.type = "rect";
    this.pos = p5.createVector(x, y);
    this.width = width;
    this.height = height;
    this.mass = mass;
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);
    this.ang = 0;

    this.color = color;
    this.movable = movable;
  }

  applyForce(force) {
    if (this.movable) {
      this.acc.x += force.x / this.mass;
      this.acc.y += force.y / this.mass;
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
  }

  getCornerCoor() {
    let botLeft = this.p5.createVector(this.pos.x - this.width / 2, this.pos.y - this.height / 2);
    let botRight = this.p5.createVector(this.pos.x + this.width / 2, this.pos.y - this.height / 2);
    let topLeft = this.p5.createVector(this.pos.x - this.width / 2, this.pos.y + this.height / 2);
    let topRight = this.p5.createVector(this.pos.x + this.width / 2, this.pos.y + this.height / 2);

    let corner = [];
    corner.push(botLeft, topLeft, topRight, botRight);
    corner = corner.map(c => rotateAbove(this.p5, c, this.pos, this.ang));

    return corner;
  }

  draw() {
    let color = this.movable ? this.color : this.p5.color(10, 10, 10);
    this.p5.fill(color);
    this.p5.push();
    this.p5.translate(this.pos.x, this.pos.y);
    this.p5.rotate(this.ang);
    this.p5.rect(0, 0, this.width, this.height);
    this.p5.pop();
  }
}