export class Rect {
  constructor(p5, x, y, width, height, color) {
    this.p5 = p5;
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0);
    this.width = width;
    this.height = height;

    this.ang = 0;
    this.angVel = 0;

    this.color = color;
    this.activated = false;
  }

  update() {
    this.pos.add(this.vel);
    this.ang += this.angVel;
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
    if (this.activated) {
      this.p5.fill("red");
    } else {
      this.p5.fill(this.color);
    }
    this.p5.push();
    this.p5.translate(this.pos.x, this.pos.y);
    this.p5.rotate(this.ang);
    this.p5.rect(0, 0, this.width, this.height);
    this.p5.pop();
    this.activated = false;
  }
}