export class Spring {
  constructor(p5, p1, p2, length) {
    this.p5 = p5;
    this.p1 = p1;
    this.p2 = p2;
    this.length = length;
    this.k = 6.0;
    this.damping = 0.99;
  }

  update() {
    let d = this.p5.dist(this.p1.pos.x, this.p1.pos.y, this.p2.pos.x, this.p2.pos.y);
    let temp1 = this.p1.pos.copy();
    let temp2 = this.p2.pos.copy();
    let dir = temp2.sub(temp1);
    dir.normalize();

    let force = this.k * (d - this.length);
    dir.mult(force);
    this.p1.applyForce(dir);
    dir.mult(-1);
    this.p2.applyForce(dir);

    this.p1.vel.mult(this.damping);
    this.p2.vel.mult(this.damping);
  }

  draw() {
    this.p5.stroke(0);
    this.p5.strokeWeight(2);
    this.p5.line(this.p1.pos.x, this.p1.pos.y, this.p2.pos.x, this.p2.pos.y);
  }
}