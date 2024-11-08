import { Circle } from "./circle.js";
import { Rect } from "./rect.js";


export class World {
  constructor(p5) {
    this.p5 = p5;
    this.gravity = this.p5.createVector(0, -10);
    this.objects = [];
    this.deltaTime = 1;
  }

  handleClick() {
    if (!this.p5.mouseIsPressed) return;

    let r = Math.random();
    let col = this.p5.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
    let temp;

    if (r < 0.5) {
      let d = randomInt(10, 25);
      temp = new Circle(this.p5, this.p5.mouseX - this.p5.width/2, -this.p5.mouseY + this.p5.height, d, d, col, true);
    } else {
      let w = randomInt(10, 25);
      let h = randomInt(10, 25);
      temp = new Rect(this.p5, this.p5.mouseX - this.p5.width/2, -this.p5.mouseY + this.p5.height, w, h, Math.max(r, h), col, true);
    }

    temp.applyTorque(randomInt(-100, 100));
    temp.applyForce(this.p5.createVector(randomInt(-100, 100), randomInt(10, 200)));
    this.add(temp);
  }

  add(object) {
    this.objects.push(object);
  }

  remove(i) {
    this.objects.splice(i, 1);
  }

  update() {
    this.objects.forEach(obj => {
      obj.applyForce(this.gravity);
    })

    this.objects.forEach(obj => {
      obj.update(this.deltaTime);
    })

    for (let i=0; i<this.objects.length-1; i++) {
      for (let j=i+1; j<this.objects.length; j++) {
        if (i === j) continue;
        this.resolveCollision(this.objects[i], this.objects[j]);
      }
    }
    
    for (let i=this.objects.length-1; i>=0; i--) {
      this.checkOutOfBoundary(i);
    }

  }

  checkOutOfBoundary(idx) {
    if (this.objects[idx].type === "circle") {
      if(this.objects[idx].pos.y - this.objects[idx].radius < 0) {
        this.objects[idx].vel.x *= 0.85;
        this.objects[idx].vel.y *= -0.3;
        this.objects[idx].pos.y = this.objects[idx].radius;
      }
    }

    if (this.objects[idx].type === "rect") {
      let coner = this.objects[idx].getConerCoor();
      let minY = 1000;

      coner.forEach(c => {
        minY = Math.min(c.y, minY);
      })

      if (minY < 0) {
        this.objects[idx].vel.x *= 0.85;
        this.objects[idx].vel.y *= -0.3;
        this.objects[idx].pos.y = this.objects[idx].pos.y - minY;
      }
    }

    if (this.objects[idx].pos.y < -20) {
      this.remove(idx);
      return;
    }

    if (this.objects[idx].pos.x < -this.p5.width / 2 - 20 || this.objects[idx].pos.x > this.p5.width / 2 + 20) {
      this.remove(idx);
      return;
    }
  }

  resolveCollision(obj1, obj2) {
    if (obj1.type === "circle" && obj2.type === "circle") {
      let d = this.p5.dist(obj1.pos.x, obj1.pos.y, obj2.pos.x, obj2.pos.y);
      if (d < obj1.radius + obj2.radius) {
        let diff = obj1.radius + obj2.radius - d;
        let dir = this.p5.createVector(obj2.pos.x - obj1.pos.x, obj2.pos.y - obj1.pos.y);

        dir.normalize();
        dir.mult(diff/2);
        obj2.pos.add(dir);
        dir.mult(-1);
        obj1.pos.add(dir);

        // computing impulse
        {
          let n = this.p5.createVector(obj2.pos.x - obj1.pos.x, obj2.pos.y - obj1.pos.y);
          n.normalize();
          let vAB = this.p5.createVector(obj1.vel.x - obj2.vel.x, obj1.vel.y - obj2.vel.y);
          
          let J = -(1+0.7) * dot(this.p5, vAB, n) * obj1.mass * obj2.mass / ( obj1.mass + obj2.mass);

          obj1.vel.add(mult(this.p5, n, J / obj1.mass));
          obj2.vel.add(mult(this.p5, n, -J / obj2.mass));
        }

        // apply collision formula
        {
          // let v21 = this.p5.createVector(obj2.vel.x - obj1.vel.x, obj2.vel.y - obj1.vel.y);
          // let x21 = this.p5.createVector(obj2.pos.x - obj1.pos.x, obj2.pos.y - obj1.pos.y);
          // x21.normalize();
  
          // let dotProduct = v21.dot(x21);
          // x21.mult(dotProduct);
  
          // let x12 = x21.copy();
  
          // obj1.vel.add(x21.mult(2*obj2.mass / (obj1.mass + obj2.mass)));
          // obj2.vel.add(x12.mult(-2*obj1.mass / (obj1.mass + obj2.mass)));
  
          // obj1.pos.add(obj1.vel);
          // obj2.pos.add(obj2.vel);
        }
      }
    }

    if ((obj1.type === "circle" && obj2.type === "rect") || (obj1.type === "rect" && obj2.type === "circle")) {
    }

    if ((obj1.type === "rect" && obj2.type === "rect")) {

      let coner1 = obj1.getConerCoor();
      let coner2 = obj2.getConerCoor();

      // for (let i=0; i<coner1.length; i++) {
      //   for (let j=0; j<coner2.length; j++) {
      //     let intersect = getIntersection(this.p5, coner1[i], coner1[(i+1)%coner1.length], coner2[j], coner2[(j+1)%coner2.length]);
      //     if (intersect !== null) {
      //       this.p5.fill("red");
      //       this.p5.circle(intersect.x, intersect.y, 10);
      //     }
      //   }
      // }
    }

  }

  translate() {
    this.p5.translate(this.p5.width/2, this.p5.height);
    this.p5.scale(1, -1);
  }

  draw() {
    this.objects.forEach(obj => {
      obj.draw();
    })
  }
}