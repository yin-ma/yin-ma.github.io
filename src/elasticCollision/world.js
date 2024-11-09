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

  addRandomObject() {
    let r = Math.random();
    let col = this.p5.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
    let temp;
    let x = randomInt(-this.p5.width / 2, this.p5.width / 2);
    let y = randomInt(-this.p5.height / 2, this.p5.height / 2);

    if (r < 0.5) {
      let d = randomInt(10, 25);
      temp = new Circle(this.p5, x, y, d, d, col, true);
    } else {
      let w = randomInt(10, 25);
      let h = randomInt(10, 25);
      temp = new Rect(this.p5, x, y, w, h, Math.max(r, h), col, true);
    }

    this.add(temp);

    return temp;
  }

  add(object) {
    this.objects.push(object);
  }

  remove(i) {
    this.objects.splice(i, 1);
  }

  update() {
    this.objects.forEach(obj => {
      if (obj.movable) {
        // obj.applyForce(this.gravity);
      }
    })

    this.objects.forEach(obj => {
      obj.update(this.deltaTime);
    })

    for (let i=0; i<this.objects.length-1; i++) {
      for (let j=i+1; j<this.objects.length; j++) {
        this.resolveCollision(this.objects[i], this.objects[j]);
      }
    }
    
    for (let i=this.objects.length-1; i>=0; i--) {
      this.checkOutOfBoundary(i);
    }

  }

  checkOutOfBoundary(idx) {
    if (this.objects[idx].pos.y <= 0) {
      this.objects[idx].pos.y = this.p5.height;
      return;
    }

    if (this.objects[idx].pos.y >= this.p5.height) {
      this.objects[idx].pos.y = 0;
      return;
    }

    if (this.objects[idx].pos.x <= -this.p5.width / 2) {
      this.objects[idx].pos.x = this.p5.width / 2;
      return;
    }

    if (this.objects[idx].pos.x >= this.p5.width / 2) {
      this.objects[idx].pos.x = -this.p5.width / 2;
      return;
    }

    // if (this.objects[idx].pos.y < -20) {
    //   this.remove(idx);
    //   return;
    // }

    // if (this.objects[idx].pos.x < -this.p5.width / 2 - 20 || this.objects[idx].pos.x > this.p5.width / 2 + 20) {
    //   this.remove(idx);
    //   return;
    // }
  }

  resolveCollision(obj1, obj2) {
    if (!obj1.movable && !obj2.movable) return;

    if (obj1.type === "circle" && obj2.type === "circle") {
      let d = this.p5.dist(obj1.pos.x, obj1.pos.y, obj2.pos.x, obj2.pos.y);
      if (d < obj1.radius + obj2.radius) {
        let diff = obj1.radius + obj2.radius - d;
        let dir = this.p5.createVector(obj2.pos.x - obj1.pos.x, obj2.pos.y - obj1.pos.y);
        dir.normalize();

        if (obj1.movable && obj2.movable) {
          dir.mult(diff/2);
          obj2.pos.add(dir);
          dir.mult(-1);
          obj1.pos.add(dir);
        }
        else {
          if (!obj1.movable) {
            dir.mult(diff);
            obj2.pos.add(dir);
          } else {
            dir.mult(-diff);
            obj1.pos.add(dir);
          }
        }

        // computing impulse
        let n = this.p5.createVector(obj2.pos.x - obj1.pos.x, obj2.pos.y - obj1.pos.y);
        n.normalize();
        this.applyImpulse(obj1, obj2, n, 1.0);
      }
    }

    else if ((obj1.type === "circle" && obj2.type === "rect") || (obj1.type === "rect" && obj2.type === "circle")) {
      if (obj2.type == "circle") {
        let temp = obj2;
        obj2 = obj1;
        obj1 = temp;
      }

      let [norm, dist] = this.satCircleRect(obj1, obj2);

      if (norm !== null) {
        if (obj1.movable && obj2.movable) {
          obj1.pos.add(mult(this.p5, norm, dist / 2));
          obj2.pos.add(mult(this.p5, norm, -dist / 2));
        } else {
          if (!obj1.movable) {
            obj2.pos.add(mult(this.p5, norm, -dist));
          } else {
            obj1.pos.add(mult(this.p5, norm, dist));
          }
        }

        this.applyImpulse(obj1, obj2, norm, 1.0);
      }
    }

    else if ((obj1.type === "rect" && obj2.type === "rect")) {
      let corner1 = obj1.getCornerCoor();
      let corner2 = obj2.getCornerCoor();
      let [norm, dist] = this.sat(corner1, corner2, obj1.pos, obj2.pos);
      
      if (norm !== null) {
        if (obj1.movable && obj2.movable) {
          obj1.pos.add(mult(this.p5, norm, dist / 2));
          obj2.pos.add(mult(this.p5, norm, -dist / 2));
        } else {
          if (!obj1.movable) {
            obj2.pos.add(mult(this.p5, norm, -dist));
          } else {
            obj1.pos.add(mult(this.p5, norm, dist));
          }
        }

        this.applyImpulse(obj1, obj2, norm, 1.0);
      }
    }
  }

  applyFriction(obj, coeff=0.6) {
    obj.applyForce(mult(this.p5, obj.vel, -1 * coeff));
  }

  applyImpulse(obj1, obj2, norm, coeff) {
    let vAB = this.p5.createVector(obj1.vel.x - obj2.vel.x, obj1.vel.y - obj2.vel.y);
    let J = -(1+coeff) * dot(this.p5, vAB, norm) * obj1.mass * obj2.mass / ( obj1.mass + obj2.mass);
    obj1.vel.add(mult(this.p5, norm, J / obj1.mass));
    obj2.vel.add(mult(this.p5, norm, -J / obj2.mass));
  }

  satCircleRect(obj1, obj2) {
    let dist = 1e12;
    let norm;

    let vertices = obj2.getCornerCoor();
  
    // project along normal of polygon
    for (let i=0; i<vertices.length; i++) {
      let edge1 = sub(this.p5, vertices[i], vertices[(i+1)%vertices.length]);
      let axis = this.p5.createVector(-edge1.y, edge1.x);
      axis.normalize();

      let circleVertice = [];
      circleVertice.push(add(this.p5, obj1.pos, mult(this.p5, axis, obj1.radius)));
      circleVertice.push(sub(this.p5, obj1.pos, mult(this.p5, axis, obj1.radius)));
      
      let [min1, max1] = project(this.p5, axis, circleVertice);
      let [min2, max2] = project(this.p5, axis, vertices);
  
      if (min1 >= max2 || min2 >= max1) return [null, null];

      let diff = Math.min(max2 - min1, max1 - min2);

      if (diff < dist) {
        dist = diff;
        norm = axis;
      }
    }

    // project along cloest point from circle to polygon
    let tempPt = closestPoint(this.p5, obj1.pos, vertices);
    let tempAxis = sub(this.p5, tempPt, obj1.pos);

    tempAxis.normalize();
    let circleVertice = [];
    circleVertice.push(add(this.p5, obj1.pos, mult(this.p5, tempAxis, obj1.radius)));
    circleVertice.push(sub(this.p5, obj1.pos, mult(this.p5, tempAxis, obj1.radius)));

    let [min1, max1] = project(this.p5, tempAxis, circleVertice);
    let [min2, max2] = project(this.p5, tempAxis, vertices);

    if (min1 >= max2 || min2 >= max1) return [null, null];

    let diff = Math.min(max2 - min1, max1 - min2);

    if (diff < dist) {
      dist = diff;
      norm = tempAxis;
    }

    let vBA = sub(this.p5, obj2.pos, obj1.pos);

    if (dot(this.p5, vBA, norm) > 0) {
      norm = mult(this.p5, norm, -1);
    }

    return [norm, dist];
  }

  sat(vertices1, vertices2, center1, center2) {
    let dist = 1e12;
    let norm;
  
    for (let i=0; i<vertices1.length; i++) {
      let edge1 = sub(this.p5, vertices1[i], vertices1[(i+1)%vertices1.length]);
      let axis = this.p5.createVector(-edge1.y, edge1.x);

      axis.normalize();
      
      let [min1, max1] = project(p5, axis, vertices1);
      let [min2, max2] = project(p5, axis, vertices2);
  
      if (min1 >= max2 || min2 >= max1) return [null, null];

      let diff = Math.min(max2 - min1, max1 - min2);

      if (diff < dist) {
        dist = diff;
        norm = axis;
      }
    }
  
    for (let i=0; i<vertices2.length; i++) {
      let edge2 = sub(this.p5, vertices2[i], vertices2[(i+1)%vertices2.length]);
      let axis = this.p5.createVector(-edge2.y, edge2.x);
      axis.normalize();
  
      let [min1, max1] = project(this.p5, axis, vertices1);
      let [min2, max2] = project(this.p5, axis, vertices2);
  
      if (min1 >= max2 || min2 >= max1) return [null, null];

      let diff = Math.min(max2 - min1, max1 - min2);

      if (diff < dist) {
        dist = diff;
        norm = axis;
      }
    }

    let vBA = sub(this.p5, center2, center1);

    if (dot(this.p5, vBA, norm) > 0) {
      norm = mult(this.p5, norm, -1);
    }

    return [norm, dist];
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