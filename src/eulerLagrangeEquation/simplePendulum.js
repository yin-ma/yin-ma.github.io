export class SimplePendulum {
  constructor(p5) {
    this.p5 = p5;
    p5.describe(
      `simple pendulum
      $$L = T - V = \\frac{1}{2}I\\dot{\\theta}^{2}-mgl-mgl\\cos\\theta$$ &nbsp;
      $$\\ddot{\\theta} = -\\frac{g}{l}\\sin\\theta$$ &nbsp;`, p5.LABEL
    );
    MathJax.typesetPromise();

    this.l = 300;
    this.gravity = 1;
    this.ball = new Ball(this.l * Math.sin(Math.PI/4), this.l * Math.cos(Math.PI/4), Math.PI/4);
  }

  update() {
    this.p5.translate(this.p5.width / 2, 0);
    this.ball.anglularAcceleration = -this.gravity / this.l * Math.sin(this.ball.theta);
    this.ball.anglularVelocity += this.ball.anglularAcceleration;
    this.ball.theta += this.ball.anglularVelocity;
    this.ball.anglularAcceleration = 0;

    this.ball.x = this.l * Math.sin(this.ball.theta);
    this.ball.y = this.l * Math.cos(this.ball.theta);
  }

  show() {
    this.p5.stroke(0);
    this.p5.strokeWeight(2);
    this.p5.line(0, 0, this.ball.x, this.ball.y);

    this.p5.fill(127);
    this.p5.circle(this.ball.x, this.ball.y, this.ball.radius * 2);
  }
}


class Ball {
  constructor(x, y, theta) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.theta = theta;
    this.anglularVelocity = 0;
    this.anglularAcceleration = 0;
  }
}