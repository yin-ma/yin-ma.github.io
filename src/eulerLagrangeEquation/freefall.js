export class FreeFall {
  constructor(p5) {
    this.p5 = p5;
    this.ball = new Ball(0, p5.height / 2);
    this.gravity = -1;
    
    p5.describe("free falling\n" + "$$L = T - V = \\frac{1}{2}m\\dot{x}^{2}-mgx$$ &nbsp;\n" + "$$\\ddot{x} = g$$ &nbsp;", p5.LABEL);
    MathJax.typesetPromise();
  }

  update() {
    this.ball.acceleration = this.gravity;
    this.ball.velocity += this.ball.acceleration;
    this.ball.y += this.ball.velocity;
    this.ball.acceleration = 0;

    if (-this.p5.height/2 + this.ball.radius > this.ball.y ) {
      this.ball.y = -this.p5.height/2 + this.ball.radius;
      this.ball.velocity *= -1;
    }
  }

  show() {
    this.p5.fill(127);
    this.p5.circle(this.ball.x, this.ball.y, this.ball.radius * 2);
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 40;
    this.velocity = 0;
    this.acceleration = 0;
  }
}