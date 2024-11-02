export class AtwoodMachine {
  constructor(p5) {
    this.p5 = p5;

    p5.describe(
      `atwood machine
      $$L = T - V = \\frac{1}{2}m_{1}\\dot{x}^{2} + \\frac{1}{2}m_{2}\\dot{x}^{2} + m_{1}gx+m_{2}gl-m_{2}gx$$ &nbsp;
      $$\\ddot{x} = \\left(\\frac{m_{1}-m_{2}}{m_{1}+m_{2}}\\right)g$$ &nbsp;`, p5.LABEL
    );
    MathJax.typesetPromise();

    this.gravity = 1;
    this.l = 100;
    this.hangingRadius = 40;
    this.bob1 = new Bob(-this.hangingRadius, this.l + this.hangingRadius + 50, 80);
    this.bob2 = new Bob(this.hangingRadius, this.p5.height - 40, 40);

    this.timer = 0;
  }

  checkBoundary() {
    if ((this.bob1.y >= this.p5.height - this.bob1.width / 2) && this.bob1.velocity >= 0) {
      this.bob1.y = this.p5.height - this.bob1.width / 2;
      this.bob1.acceleration = 0;
      this.bob1.velocity = 0;
      this.bob2.acceleration = 0;
      this.bob2.velocity = 0;
      return true;
    }
    if ((this.bob1.y < this.l + this.hangingRadius + this.bob1.width / 2 + 10) && this.bob1.velocity <= 0) {
      this.bob1.y = this.l + this.hangingRadius + this.bob1.width / 2 + 10;
      this.bob1.acceleration = 0;
      this.bob1.velocity = 0;
      this.bob2.acceleration = 0;
      this.bob2.velocity = 0;
      return true;
    }
    if ((this.bob2.y >= this.p5.height - this.bob2.width / 2) && this.bob2.velocity >= 0) {
      this.bob2.y = this.p5.height - this.bob2.width / 2;
      this.bob1.acceleration = 0;
      this.bob1.velocity = 0;
      this.bob2.acceleration = 0;
      this.bob2.velocity = 0;
      return true;
    }
    if ((this.bob2.y < this.l + this.hangingRadius + this.bob2.width / 2 + 10) && this.bob2.velocity <= 0) {
      this.bob2.y = this.l + this.hangingRadius + this.bob2.width / 2 + 10;
      this.bob1.acceleration = 0;
      this.bob1.velocity = 0;
      this.bob2.acceleration = 0;
      this.bob2.velocity = 0;
      return true;
    }
    
    return false;
  }

  update() {
    this.p5.translate(this.p5.width / 2, 0);
    
    this.timer += 1;
    if (this.timer >= 200) {
      this.timer = 0;
      let tempMass = this.bob1.mass;
      let tempWidth = this.bob1.width;

      this.bob1.mass = this.bob2.mass;
      this.bob1.width = this.bob2.width;
      this.bob2.mass = tempMass;
      this.bob2.width = tempWidth;
      this.bob1.velocity = 0;
      this.bob2.velocity = 0;
      
      this.bob1.acceleration = 0;
      this.bob2.acceleration = 0;
    }

    if (this.checkBoundary()) return;

    this.bob1.acceleration = (this.bob1.mass - this.bob2.mass) / (this.bob1.mass + this.bob2.mass) * this.gravity;
    this.bob1.velocity += this.bob1.acceleration;
    this.bob1.y += this.bob1.velocity;
    
    this.bob2.acceleration = -this.bob1.acceleration;
    this.bob2.velocity += this.bob2.acceleration;
    this.bob2.y += this.bob2.velocity;

    this.bob1.acceleration = 0;
    this.bob2.acceleration = 0;
  }

  show() {
    // hanging
    this.p5.stroke(0);
    this.p5.strokeWeight(2);
    this.p5.line(0, 0, 0, this.l);
    this.p5.fill(127);
    this.p5.circle(0, this.l, this.hangingRadius * 2);

    // two bobs
    this.p5.line(-this.hangingRadius, this.l, this.bob1.x, this.bob1.y);
    this.bob1.draw(this.p5);
    this.p5.line(this.hangingRadius, this.l, this.bob2.x, this.bob2.y);
    this.bob2.draw(this.p5);
  }
}


class Bob {
  constructor(x, y, mass) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.width = mass;
    this.acceleration = 0;
    this.velocity = 0;
  }

  draw(p5) {
    p5.square(this.x - this.width / 2, this.y - this.width / 2, this.width);
  }
}