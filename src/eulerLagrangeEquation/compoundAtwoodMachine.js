export class CompoundAtwoodMachine {
  constructor(p5) {
    this.p5 = p5;

    p5.describe(
      `compound atwood machine
      $$L = T - V$$&nbsp;
      $$T = \\frac{1}{2}m_{1}\\dot{x}^{2} + \\frac{1}{2}m_{2}(\\dot{x} - \\dot{y})^{2} + \\frac{1}{2}m_{3}(\\dot{x} + \\dot{y})^{2}$$ &nbsp;
      $$V = -m_{1}gx-m_{2}g(l_{a}-x+y)-m_{3}g(l_{a}-x+l_{b}-y)$$&nbsp;
      $$\\ddot{x} = \\frac{(m_{1}m_{2}-4m_{2}m_{3}+m_{1}m_{3})}{m_{1}m_{2}+4m_{2}m_{3}+m_{1}m_{3}}g$$ &nbsp;
      $$\\ddot{y} = \\frac{2m_{1}(m_{3}-m_{2})}{-m_{1}(m_{2}+m_{3})-4m_{2}m_{3}}g$$ &nbsp;`, p5.LABEL
    );
    MathJax.typesetPromise();

    this.gravity = 0.01;

    this.pulley1 = new Pulley(0, 0, 55, 30);
    this.pulley2 = new Pulley(-this.pulley1.radius, this.pulley1.y + this.pulley1.length, 100 + this.pulley1.radius, 10);
    this.bob1 = new Bob(this.pulley1.radius, this.pulley1.y + this.pulley1.length + this.pulley1.radius + 30, 50, 50);
    this.bob2 = new Bob(-this.pulley1.radius+this.pulley2.radius, this.pulley2.y + this.pulley2.length + this.pulley2.radius + 25, 20, 20);
    this.bob3 = new Bob(-this.pulley1.radius-this.pulley2.radius, this.p5.height - 10 - 10, 10, 10);

  }

  checkBoundary() {
    let flag = false;
    if ((this.bob1.y - this.bob1.width/2 <= this.pulley1.y + this.pulley1.length + this.pulley1.radius) && this.bob1.velocity < 0) {
      this.bob1.y = this.pulley1.y + this.pulley1.length + this.pulley1.radius + this.bob1.width/2;
      flag = true;
    }
    if ((this.bob1.y + this.bob1.width / 2 >= this.p5.height) && this.bob1.velocity > 0) {
      this.bob1.y = this.p5.height - this.bob1.width / 2;
      flag = true;
    }

    if (this.pulley2.length < this.pulley1.radius) {
      this.pulley2.length = this.pulley1.radius;
      flag = true;    
    }

    if ((this.bob2.y - this.bob2.width / 2 <= this.pulley2.y + this.pulley2.length + this.pulley2.radius) && this.bob2.velocity < 0 ) {
      this.bob2.y = this.pulley2.y + this.pulley2.length + this.pulley2.radius + this.bob2.width / 2;
      flag = true;
    }

    if ((this.bob2.y + this.bob2.width / 2 >= this.p5.height) && this.bob2.velocity > 0) {
      this.bob2.y = this.p5.height - this.bob2.width / 2;
      flag = true;
    }

    if ((this.bob3.y - this.bob3.width / 2 <= this.pulley2.y + this.pulley2.length + this.pulley2.radius) && this.bob3.velocity < 0 ) {
      this.bob3.y = this.pulley2.y + this.pulley2.length + this.pulley2.radius + this.bob3.width / 2;
      flag = true;
    }

    if (((this.bob3.y + this.bob3.width / 2) >= this.p5.height) && this.bob3.velocity > 0) {
      this.bob3.y = this.p5.height - this.bob3.width / 2;
      flag = true;
    }

    return flag;
  }

  stop() {
    this.bob1.acceleration = 0;
    this.bob1.velocity = 0;
    this.bob2.acceleration = 0;
    this.bob2.velocity = 0;
    this.bob3.acceleration = 0;
    this.bob3.velocity = 0;
  }

  update() {
    this.p5.translate(this.p5.width / 2, 0);

    if (this.checkBoundary()) {
      this.stop();
      return;
    }

    let tempTop = this.bob1.mass * this.bob2.mass - 4 * this.bob2.mass * this.bob3.mass + this.bob1.mass * this.bob3.mass;
    let tempBot = this.bob1.mass * this.bob2.mass + 4 * this.bob2.mass * this.bob3.mass + this.bob1.mass * this.bob3.mass;
    this.bob1.acceleration = tempTop / tempBot * this.gravity;

    this.bob1.velocity += this.bob1.acceleration;
    this.bob1.y += this.bob1.velocity;
    this.pulley2.length -= this.bob1.velocity;

    let temp_acceleration;
    tempTop = 2 * this.bob1.mass * (this.bob3.mass - this.bob2.mass);
    tempBot = -this.bob1.mass * (this.bob2.mass + this.bob3.mass) - 4 * this.bob2.mass * this.bob3.mass;
    temp_acceleration = tempTop / tempBot * this.gravity;

    // temp_acceleration = (this.bob2.mass - this.bob3.mass) * this.gravity - (this.bob3.mass - this.bob2.mass) * this.bob1.acceleration;
    // temp_acceleration = temp_acceleration / (this.bob2.mass + this.bob3.mass);
    
    this.bob2.acceleration = -this.bob1.acceleration + temp_acceleration;
    this.bob2.velocity += this.bob2.acceleration;
    this.bob2.y += this.bob2.velocity;

    this.bob3.acceleration = -this.bob1.acceleration - temp_acceleration;
    this.bob3.velocity += this.bob3.acceleration;
    this.bob3.y += this.bob3.velocity;

    this.bob1.acceleration = 0;
    this.bob2.acceleration = 0;
    this.bob3.acceleration = 0;
  }

  show() {
    this.pulley1.draw(this.p5);
    this.bob1.draw(this.p5);

    this.pulley2.draw(this.p5);
    this.bob2.draw(this.p5);

    this.bob3.draw(this.p5);

    this.p5.stroke(0);
    this.p5.strokeWeight(2);
    // draw wire
    // pl1 to m1
    this.p5.line(this.pulley1.x+this.pulley1.radius, this.pulley1.y + this.pulley1.length, this.bob1.x, this.bob1.y - this.bob1.width/2);

    // pl2 to m2
    this.p5.line(this.pulley2.x+this.pulley2.radius, this.pulley2.y + this.pulley2.length, this.bob2.x, this.bob2.y - this.bob2.width/2);

    // pl3 to m3
    this.p5.line(this.pulley2.x-this.pulley2.radius, this.pulley2.y + this.pulley2.length, this.bob3.x, this.bob3.y - this.bob3.width/2);
    
  }
}


class Bob {
  constructor(x, y, mass, width) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.width = width;
    this.velocity = 0;
    this.acceleration = 0;
  }

  draw(p5) {
    p5.square(this.x - this.width / 2, this.y - this.width / 2, this.width);
  }
}

class Pulley {
  constructor(x, y, length, radius) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.radius = radius;
  }

  draw(p5) {
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.line(this.x, this.y, this.x, this.y + this.length);
    p5.fill(127);
    p5.circle(this.x, this.y + this.length, this.radius * 2);
  }
}