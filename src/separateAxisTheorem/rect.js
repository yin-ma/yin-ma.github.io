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
  }

  update() {
    this.pos.add(this.vel);
    this.ang += this.angVel;
  }

  getConerCoor() {
    let botLeft = this.p5.createVector(this.pos.x - this.width / 2, this.pos.y - this.height / 2);
    let botRight = this.p5.createVector(this.pos.x + this.width / 2, this.pos.y - this.height / 2);
    let topLeft = this.p5.createVector(this.pos.x - this.width / 2, this.pos.y + this.height / 2);
    let topRight = this.p5.createVector(this.pos.x + this.width / 2, this.pos.y + this.height / 2);

    let coner = [];
    coner.push(botLeft, topLeft, topRight, botRight);
    coner = coner.map(c => rotateAbove(this.p5, c, this.pos, this.ang));

    return coner;
  }

  draw() {
    this.p5.fill(this.color);
    this.p5.push();
    this.p5.translate(this.pos.x, this.pos.y);
    this.p5.rotate(this.ang);
    this.p5.rect(0, 0, this.width, this.height);
    this.p5.pop();
  }
}