export class Circle
{
  constructor(p5, x, y, radius, color) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velx = 0;
    this.vely = 0;
  }

  update() {
    this.x += this.velx;
    this.y += this.vely;
  }

  draw() {
    this.p5.fill(this.color);
    this.p5.circle(this.x, this.y, this.radius*2);
  }
}