export class SHM {
  constructor(p5) {
    this.p5 = p5;
    p5.describe("simple harmonic motion\n" + "$$L = T - V = \\frac{1}{2}m\\dot{x}^{2}-\\frac{1}{2}kx^{2}$$ &nbsp;\n" + "$$\\ddot{x} = -\\frac{k}{m}x$$ &nbsp;", p5.LABEL);
    MathJax.typesetPromise();

    this.ball = new Ball(p5.width / 2 - 60, 0);
    this.k = 0.05;
  }

  update() {
    this.ball.acceleration = - this.k / this.ball.mass * this.ball.x;
    this.ball.velocity += this.ball.acceleration;
    this.ball.x += this.ball.velocity;
    this.ball.acceleration = 0;
  }

  show() {
    this.p5.translate(this.p5.width / 2, this.p5.height / 2);
    this.p5.scale(1, -1);
    this.p5.fill(127);
    this.p5.circle(this.ball.x, this.ball.y, this.ball.radius * 2);
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.mass = 40;
    this.radius = 40;
    this.velocity = 0;
    this.acceleration = 0;
  }
}