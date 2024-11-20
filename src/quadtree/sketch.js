import { Circle } from "./circle.js";
import { QuadTree } from "./quad.js";

let p5js;
let circles = [];

let numCircle = 100;
let maxRad = 2;
let minRad = 2;
let numGrid = 10; // no of grid per row/col
let capacity = 4;
let depth = 7;

const sketch = (p) => {

  p.setup = () => { 
    p5js = p;
    p.createCanvas(600, 400);
    p.rectMode(p.CENTER);

    for (let i=0; i<numCircle; i++) {
      let c = createCircle(p);
      circles.push(c);
    }

  };

  p.draw = () => {
    p.background(255);
    p.translate(p.width/2, p.height/2);
    p.scale(1, -1);

    checkBoundary(p);
    circles.forEach(c => c.update());

    useQuadtree();
    // spatialHasing();
    // naiveApproch();
    
    circles.forEach(c => c.draw());

    printFPS();
  };


  p.mouseDragged = () => {
    handleDragged();
  }

};

new p5(sketch);

function useQuadtree() {
  let qt = new QuadTree(-p5js.width/2, p5js.width/2, -p5js.height/2, p5js.height/2, depth, capacity);
  circles.forEach(c => {
    qt.add(c);
  })
  qt.draw(p5js);

  circles.forEach(c => {
    let mem = qt.get(c);

    mem.forEach(m => {
      if (m !== c) {
        resolveCollision(c, m);
      }
    })
  })
}

function spatialHasing() {
  let map = new Map();

  circles.forEach(c => {
    let n = gridNum(c.x, c.y);
    if (map.has(n)) {
      map.get(n).push(c);
    } else {
      map.set(n, [c]);
    }
  })

  map.forEach((v, k) => {
    let cs = v;
    for(let i=0; i<cs.length-1; i++) {
      for (let j=i+1; j<cs.length; j++) {
        resolveCollision(cs[i], cs[j]);
      }
    }
  })
}

function naiveApproch() {
  for (let i=0; i<numCircle-1; i++) {
    for (let j=i+1; j<numCircle; j++) {
      resolveCollision(circles[i], circles[j]);
    }
  }
}

function gridNum(x, y) {
  let col = Math.floor((x + p5js.width/2) / (p5js.width / numGrid));
  let row = Math.floor((y + p5js.height/2) / (p5js.height / numGrid));

  return row*numGrid+col;
}

function checkCollision(c1, c2) {
  return sqdist(c1, c2) < Math.pow((c1.radius + c2.radius), 2);
}

function resolveCollision(c1, c2) {
  let d = dist(c1, c2);
  if (d < c1.radius + c2.radius) {
    let diff = c1.radius + c2.radius - d;
    let dir = p5js.createVector(c2.x - c1.x, c2.y - c1.y);
    dir.normalize();

    dir.mult(diff/2);
    c2.x += dir.x;
    c2.y += dir.y;
    dir.mult(-1);
    c1.x += dir.x;
    c1.y += dir.y;

    let x1 = p5js.createVector(c1.x, c1.y);
    let x2 = p5js.createVector(c2.x, c2.y);
    let v1 = p5js.createVector(c1.velx, c1.vely);
    let v2 = p5js.createVector(c2.velx, c2.vely);

    let x12 = sub(p5js, x1, x2);
    let temp = dot(p5js, sub(p5js, v1, v2), x12) / sqLen(p5js, x12);

    c1.velx = c1.velx - 2 * c2.radius / (c1.radius + c2.radius) * temp * x12.x;
    c1.vely = c1.vely - 2 * c2.radius / (c1.radius + c2.radius) * temp * x12.y;

    c2.velx = c2.velx - 2 * c1.radius / (c1.radius + c2.radius) * temp * -x12.x;
    c2.vely = c2.vely - 2 * c1.radius / (c1.radius + c2.radius) * temp * -x12.y;
  }
}


function dist(c1, c2) {
  return Math.sqrt(Math.pow((c1.x - c2.x), 2) + Math.pow((c1.y - c2.y), 2));
}

function sqdist(c1, c2) {
  return Math.pow((c1.x - c2.x), 2) + Math.pow((c1.y - c2.y), 2);
}

function checkBoundary(p) {
  circles.forEach(c => {
    if ((c.x - c.radius < -p.width / 2) && c.velx < 0) {
      c.x = -p.width/2 + c.radius;
      c.velx *= -1;
    }

    if ((c.x + c.radius > p.width / 2) && c.velx > 0) {
      c.x = p.width/2 - c.radius;
      c.velx *= -1;
    }

    if ((c.y - c.radius < -p.height / 2) && c.vely < 0) {
      c.y = -p.height/2 + c.radius;
      c.vely *= -1;
    }

    if ((c.y + c.radius > p.height / 2) && c.vely > 0) {
      c.y = p.height/2 - c.radius;
      c.vely *= -1;
    }

  })
}

function printFPS() {
  let fps = p5js.frameRate();
  p5js.push();
  p5js.scale(1, -1);
  p5js.fill(0);
  p5js.translate(p5js.width/2 - 50, p5js.height/2 - 10);
  p5js.text(fps.toFixed(4), 0, 0);
  p5js.pop();
}

function createStaticCircle(p) {
  let c = new Circle(p, randomBetween(-p.width/2, p.width/2), randomBetween(-p.height/2, p.height/2), randomBetween(minRad, maxRad), randomColor(p));
  return c;
}

function createCircle(p) {
  let c = new Circle(p, randomBetween(-p.width/2, p.width/2), randomBetween(-p.height/2, p.height/2), randomBetween(minRad, maxRad), randomColor(p));
  c.velx = randomBetween(-5, 5);
  c.vely = randomBetween(-5, 5);
  return c;
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomColor(p) {
  return p.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
}


function handleDragged() {
  let x = p5js.mouseX - p5js.width/2;
  let y = -p5js.mouseY + p5js.height/2;
  let c = new Circle(p5js, x, y, randomBetween(minRad, maxRad), randomColor(p5js));
  circles.push(c);
}