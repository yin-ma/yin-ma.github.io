import { Circle } from "./circle.js";
import { Rect } from "./rect.js";


export class World {
  constructor(p5) {
    this.p5 = p5;
    this.gravity = this.p5.createVector(0, -0.3);
    this.objects = [];
    this.deltaTime = 0.7;
    this.impulseCoeff = 0.4;
    this.applyGravity = true;

    this.interation = 4;

    this.staticFriction = 0.7;
    this.dynamticFriction = 0.5;

    this.debug = false;
  }

  handleClick() {
    if (!this.p5.mouseIsPressed) return;

    let r = Math.random();
    let col = this.p5.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
    let temp;

    if (r < 0.5) {
      let d = randomInt(20, 35);
      temp = new Circle(this.p5, this.p5.mouseX - this.p5.width/2, -this.p5.mouseY + this.p5.height, d, d*d, col, true);
    } else {
      let w = randomInt(20, 35);
      let h = randomInt(20, 35);
      temp = new Rect(this.p5, this.p5.mouseX - this.p5.width/2, -this.p5.mouseY + this.p5.height, w, h, w*h, col, true);
    }

    this.add(temp);
  }

  addRandomObject(movable=true) {
    let r = Math.random();
    let temp;

    if (r > 0.5) {
      temp = this.addRandomCircle(movable);
    } else {
      temp = this.addRandomRect(movable);
    }

    return temp;
  }

  addRandomCircle(movable=true) {
    let d = randomInt(20, 35);
    let col = this.p5.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
    let x = randomInt(-this.p5.width / 2 + 20, this.p5.width / 2 - 20);
    let y = randomInt(20, this.p5.height - 20);
    let weight = d*d;
    let temp = new Circle(this.p5, x, y, d, weight, col, movable);
    this.add(temp);
    return temp;
  }

  addRandomRect(movable=true) {
    let col = this.p5.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
    let x = randomInt(-this.p5.width / 2 + 20, this.p5.width / 2 - 20);
    let y = randomInt(20, this.p5.height - 20);
    let w = randomInt(20, 35);
    let h = randomInt(20, 35);
    let weight = w*h;
    let temp = new Rect(this.p5, x, y, w, h, weight, col, movable);
    this.add(temp);
    return temp;
  }

  add(object) {
    this.objects.push(object);
  }

  remove(idx) {
    this.objects.splice(idx, 1);
  }

  update() {
    for (let p=0; p<this.interation; p++) {
      this.objects.forEach(obj => {
        if (this.applyGravity && obj.movable) {
          obj.applyForce(mult(this.p5, this.gravity, obj.mass));
        }
      })

      this.objects.forEach(obj => {
        if (obj.movable) {
          obj.update(this.deltaTime / this.interation);
        }
      })

      for (let i=0; i<this.objects.length-1; i++) {
        for (let j=i+1; j<this.objects.length; j++) {
          this.resolveCollision(this.objects[i], this.objects[j]);
        }
      }
    }

    for (let i=this.objects.length-1; i>=0; i--) {
      this.checkOutOfBoundary(i);
    }

  }

  checkOutOfBoundary(idx) {
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
        let norm = sub(this.p5, obj1.pos, obj2.pos);
        norm.normalize();
        
        let pts = this.circleCircleIntesection(obj1, obj2);
        let Js = this.applyImpulseWithRotation(obj1, obj2, norm, [pts], this.impulseCoeff);
        this.applyImpulseWithRotationFriction(obj1, obj2, norm, [pts], Js, this.impulseCoeff);

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

        
        let pts = this.circleRectIntesection(obj1, obj2);
        let Js = this.applyImpulseWithRotation(obj1, obj2, norm, [pts], this.impulseCoeff);
        this.applyImpulseWithRotationFriction(obj1, obj2, norm, [pts], Js, this.impulseCoeff);
        
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

        let temp = this.rectRectIntersection(obj1, obj2);
        let pts = [];
        if (temp.length === 1) pts.push(temp[0]);
        if (temp.length === 2) {
          pts.push(this.p5.createVector(temp[0].x * 0.5 + temp[1].x * 0.5, temp[0].y * 0.5 + temp[1].y * 0.5));
        }
        let Js = this.applyImpulseWithRotation(obj1, obj2, norm, pts, this.impulseCoeff);
        this.applyImpulseWithRotationFriction(obj1, obj2, norm, pts, Js, this.impulseCoeff);

      }
    }
  }

  rectRectIntersection(obj1, obj2) {
    let vertices1 = obj1.getCornerCoor();
    let vertices2 = obj2.getCornerCoor();

    let shortestDist = 1e8;
    let shortestPoint1 = null;
    let shortestPoint2 = null;
    let count = 0;

    for (let i=0; i<vertices1.length; i++) {
      for (let j=0; j<vertices2.length; j++) {
        let projection = this.projectPointToLine(vertices1[i], vertices2[j], vertices2[(j+1)%vertices2.length]);
        let tempDist = sqLen(this.p5, sub(this.p5, vertices1[i], projection));

        if (this.nearlyEqualValue(tempDist, shortestDist)) {
          if (!this.nearlyEqual(projection, shortestPoint1)) {
            shortestPoint2 = projection;
            count = 2;
          }

        } else if (tempDist < shortestDist) {
          shortestDist = tempDist;
          shortestPoint1 = projection;
          shortestPoint2 = null;
          count = 1;
        }
      }
    }

    for (let i=0; i<vertices2.length; i++) {
      for (let j=0; j<vertices1.length; j++) {
        let projection = this.projectPointToLine(vertices2[i], vertices1[j], vertices1[(j+1)%vertices1.length]);
        let tempDist = sqLen(this.p5, sub(this.p5, vertices2[i], projection));

        if (this.nearlyEqualValue(tempDist, shortestDist)) {
          if (!this.nearlyEqual(projection, shortestPoint1)) {
            shortestPoint2 = projection;
            count = 2;
          }

        } else if (tempDist < shortestDist) {
          shortestDist = tempDist;
          shortestPoint1 = projection;
          shortestPoint2 = null;
          count = 1;
        }
      }
    }

    if (count === 1) {
      return [shortestPoint1];
    }
    if (count === 2) {
      return [shortestPoint1, shortestPoint2];
    }

  }

  nearlyEqualValue(a, b) {
    if (Math.abs(a - b) < 0.05) return true;
    return false;
  }

  nearlyEqual(pt1, pt2, th=0.05) {
    if (Math.abs(pt1.x - pt2.x) < th && Math.abs(pt1.y - pt2.y) < th) {
      return true;
    }
    return false;
  }

  circleCircleIntesection(obj1, obj2) {
    let vAB = sub(this.p5, obj2.pos, obj1.pos);
    vAB.normalize();
    let pt = add(this.p5, obj1.pos, mult(this.p5, vAB, obj1.radius));
    return pt;
  }

  circleRectIntesection(obj1, obj2) {
    let [temp, tempDist] = this.shortestDistBetweenPointAndPolygon(obj1.pos, obj2.getCornerCoor());
    return temp;
  }

  projectPointToLine(pos, vertices1, vertices2) {
    let orgEdge = sub(this.p5, vertices2, vertices1);
    let edge = sub(this.p5, vertices2, vertices1);
    edge.normalize();

    let vAO = sub(this.p5, pos, vertices1);
    let lenFromA = dot(this.p5, vAO, edge);
    let projectedVec = mult(this.p5, edge, lenFromA);

    let dotAP = dot(this.p5, projectedVec, orgEdge);
    let dotAB = dot(this.p5, orgEdge, orgEdge);

    let t = dotAP / dotAB;

    if (t > 1) {
      projectedVec = orgEdge;
    }
    if (t < 0) {
      projectedVec = this.p5.createVector(0, 0);
    }

    return add(this.p5, vertices1, projectedVec);
  }

  shortestDistBetweenPointAndPolygon(pos, vertices) {
    let shortestDist = 1e8;
    let shortestProjectedPoint;
    for(let i=0; i<vertices.length; i++) {
      let projection = this.projectPointToLine(pos, vertices[i], vertices[(i+1)%vertices.length]);

      let dist = sub(this.p5, pos, projection);
      let lenDist = sqLen(this.p5, dist);
  
      if (lenDist < shortestDist) {
        shortestDist = lenDist;
        shortestProjectedPoint = projection;
      }
    }
    return [shortestProjectedPoint, shortestDist];
  }

  applyImpulseWithRotationFriction(obj1, obj2, norm, pointOfContacts, Js, coeff) {
    if (this.debug) {
      pointOfContacts.forEach(pt => {
        this.drawLine(pt, add(this.p5, pt, mult(this.p5, norm, 20)));
        this.drawLine(pt, sub(this.p5, pt, mult(this.p5, norm, 20)));
      })
    }

    let fs = [];
    let rs = [];
    let tens = [];

    for (let i=0; i<pointOfContacts.length; i++) {
      let rAP = sub(this.p5, pointOfContacts[i], obj1.pos);
      let rBP = sub(this.p5, pointOfContacts[i], obj2.pos);
      
      let rAPper = this.p5.createVector(-rAP.y, rAP.x);
      let rBPper = this.p5.createVector(-rBP.y, rBP.x);

      if (this.debug) {
        this.drawLine(pointOfContacts[i], add(this.p5, pointOfContacts[i], rAPper), 3, "blue");
        this.drawLine(pointOfContacts[i], add(this.p5, pointOfContacts[i], rBPper), 3, "blue");
      }

      let aAngVel = mult(this.p5, rAPper, obj1.angVel);
      let bAngVel = mult(this.p5, rBPper, obj2.angVel);

      let vAP = add(this.p5, obj1.vel, aAngVel);
      let vBP = add(this.p5, obj2.vel, bAngVel);

      let vAB = sub(this.p5, vBP, vAP);
      let tangent;
      tangent = sub(this.p5, vAB, mult(this.p5, norm, dot(this.p5, vAB, norm)));


      if (this.debug) {
        this.drawLine(pointOfContacts[i], add(this.p5, pointOfContacts[i], mult(this.p5, tangent, 50)), 3, "green");
      }

      let raDotT = dot(this.p5, rAPper, tangent);
      let rbDotT = dot(this.p5, rBPper, tangent);

      let top = -dot(this.p5, vAB, tangent);
      let bot = obj1.invMass + obj2.invMass + (raDotT * raDotT) * obj1.invInertia + (rbDotT * rbDotT) * obj2.invInertia;

      let J = top / bot;

      if (Math.abs(J) >= Js[i] * this.staticFriction) {
        J = -Js[i] * this.dynamticFriction;
      }

      fs.push(J);
      rs.push([rAPper, rBPper]);
      tens.push(tangent);
    }

    fs.forEach((J, idx) => {
      obj1.vel.add(mult(this.p5, tens[idx], -J * obj1.invMass));
      obj2.vel.add(mult(this.p5, tens[idx], J * obj2.invMass));

      obj1.angVel = obj1.angVel - J * obj1.invInertia * dot(this.p5, rs[idx][0], tens[idx]);
      obj2.angVel = obj2.angVel + J * obj2.invInertia * dot(this.p5, rs[idx][1], tens[idx]);
    })
  }

  applyImpulseWithRotation(obj1, obj2, norm, pointOfContacts, coeff=1.0) {

    let im = [];
    let rs = [];

    for (let i=0; i<pointOfContacts.length; i++) {
      let rAP = sub(this.p5, pointOfContacts[i], obj1.pos);
      let rBP = sub(this.p5, pointOfContacts[i], obj2.pos);
      
      let rAPper = this.p5.createVector(-rAP.y, rAP.x);
      let rBPper = this.p5.createVector(-rBP.y, rBP.x);

      let aAngVel = mult(this.p5, rAPper, obj1.angVel);
      let bAngVel = mult(this.p5, rBPper, obj2.angVel);

      let vAP = add(this.p5, obj1.vel, aAngVel);
      let vBP = add(this.p5, obj2.vel, bAngVel);

      let vAB = sub(this.p5, vAP, vBP);

      if (dot(this.p5, vAB, norm) > 0) continue;

      let raDotnorm = dot(this.p5, rAPper, norm);
      let rbDotnorm = dot(this.p5, rBPper, norm);

      let top = -(1+coeff) * dot(this.p5, vAB, norm);
      let bot = obj1.invMass + obj2.invMass + (raDotnorm * raDotnorm) * obj1.invInertia + (rbDotnorm * rbDotnorm) * obj2.invInertia;

      let J = top / bot;

      im.push(J);
      rs.push([rAPper, rBPper]);
    }

    im.forEach((J, idx) => {
      obj1.vel.add(mult(this.p5, norm, J * obj1.invMass));
      obj2.vel.add(mult(this.p5, norm, -J * obj2.invMass));

      obj1.angVel = obj1.angVel + J * obj1.invInertia * dot(this.p5, rs[idx][0], norm);
      obj2.angVel = obj2.angVel - J * obj2.invInertia * dot(this.p5, rs[idx][1], norm);

    })

    return im;
  }

  drawCircle(p, radius=5, color="red") {
    this.p5.fill(color);
    this.p5.circle(p.x, p.y, radius*2);
  }

  drawLine(p1, p2, weight=4, color="red") {
    this.p5.strokeWeight(weight);
    this.p5.stroke(color);
    this.p5.line(p1.x, p1.y, p2.x, p2.y);
    this.p5.strokeWeight(1);
    this.p5.stroke("black");
  }

  applyImpulse(obj1, obj2, norm, coeff) {
    let vAB = this.p5.createVector(obj1.vel.x - obj2.vel.x, obj1.vel.y - obj2.vel.y);
    let J = -(1+coeff) * dot(this.p5, vAB, norm) / ( obj1.invMass + obj2.invMass);

    if (obj1.movable) obj1.vel.add(mult(this.p5, norm, J * obj1.invMass));
    if (obj2.movable) obj2.vel.add(mult(this.p5, norm, -J * obj2.invMass));
  }

  satCircleRect(obj1, obj2) {
    let dist = 1e12;
    let norm;

    let vertices = obj2.getCornerCoor();
  
    // project polygon along normal
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

    // project polygon along cloest point from circle to polygon
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