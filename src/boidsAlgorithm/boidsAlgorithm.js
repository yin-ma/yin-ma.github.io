const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;

const boids = [];
const numBoids = 150;

const visualRange = 75;
const separationDistance = 25;


class Boid {
  constructor() {
    this.position = {x: Math.random() * canvasWidth, y: Math.random() * canvasHeight};
    this.velocity = {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1};
    this.maxSpeed = 3;
    this.maxForce = 0.05;
  }

  draw() {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x));

    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, 5);
    ctx.lineTo(-5, -5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();    
    ctx.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  edges() {
    if (this.position.x > canvasWidth) this.position.x = 0;
    if (this.position.y > canvasHeight) this.position.y = 0;
    if (this.position.x < 0) this.position.x = canvasWidth;
    if (this.position.y < 0) this.position.y = canvasHeight;
  }

  applyRules(flock) {
    let alignment = this.align(flock);
    let cohesion = this.cohesion(flock);
    let separation = this.separation(flock);

    this.velocity.x += alignment.x + cohesion.x + 2.0*separation.x;
    this.velocity.y += alignment.y + cohesion.y + 2.0*separation.y;

    const speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
    if (speed > this.maxSpeed) {
      this.velocity.x = this.velocity.x / speed * this.maxSpeed;
      this.velocity.y = this.velocity.y / speed * this.maxSpeed;
    }
  }

  steer(desired) {
    let steer = { x: desired.x - this.velocity.x, y: desired.y - this.velocity.y};
    const mag = Math.sqrt(steer.x*steer.x + steer.y*steer.y);
    if (mag > this.maxForce) {
      steer.x = steer.x * this.maxForce / mag;
      steer.y = steer.y * this.maxForce / mag;
    }
    return steer;
  }

  align(flock) {
    let avgVelocity = { x: 0, y: 0};
    let total = 0;

    for (let other of flock) {
      const d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
      if (other !== this && d < visualRange) {
        avgVelocity.x += other.velocity.x;
        avgVelocity.y += other.velocity.y;
        total++;
      }
    }

    if (total>0) {
      avgVelocity.x /= total;
      avgVelocity.y /= total;
      const mag = Math.sqrt(avgVelocity.x*avgVelocity.x + avgVelocity.y*avgVelocity.y);
      avgVelocity.x = avgVelocity.x / mag * this.maxSpeed;
      avgVelocity.y = avgVelocity.y / mag * this.maxSpeed;
      return this.steer(avgVelocity);
    }
    return {x: 0, y: 0}
  }

  cohesion(flock) {
    let avgPosition = {x: 0, y: 0};
    let total = 0;

    for (let other of flock) {
      const d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
      if (other !== this && d < visualRange) {
        avgPosition.x += other.position.x;
        avgPosition.y += other.position.y;
        total++;
      }
    }

    if (total>0) {
      avgPosition.x /= total;
      avgPosition.y /= total;
      let desired = { x: avgPosition.x - this.position.x, y: avgPosition.y - this.position.y};
      const mag = Math.sqrt(desired.x*desired.x + desired.y*desired.y);
      desired.x = desired.x / mag * this.maxSpeed;
      desired.y = desired.y / mag * this.maxSpeed;
      return this.steer(desired);
    }

    return {x: 0, y: 0}
  }

  separation(flock) {
    let avgVelocity = {x: 0, y:0};
    let total = 0;
    for (let other of flock) {
      const d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
      if (other !== this && d < separationDistance) {
        let diff = { x: this.position.x - other.position.x, y: this.position.y - other.position.y};
        avgVelocity.x += diff.x / (d*d);
        avgVelocity.y += diff.y / (d*d);
        total++;
      }
    }

    if (total>0) {
      avgVelocity.x /= total;
      avgVelocity.y /= total;
      const mag = Math.sqrt(avgVelocity.x*avgVelocity.x + avgVelocity.y*avgVelocity.y);
      if (mag>0) {
        avgVelocity.x = avgVelocity.x / mag * this.maxSpeed;
        avgVelocity.y = avgVelocity.y / mag * this.maxSpeed;
      }
      return this.steer(avgVelocity);
    }

    return {x: 0, y: 0}
  }
}



for (let i=0; i < numBoids; i++) {
  boids.push(new Boid());
}


function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let boid of boids) {
    boid.edges();
    boid.applyRules(boids);
    boid.update();
    boid.draw();
  }

  requestAnimationFrame(animate);
}

animate();