import { Rect } from "./rect.js";

let squares = [];
let overlap = false;

const sketch = (p) => {

  p.setup = () => { 
    p.createCanvas(600, 400);
    p.rectMode(p.CENTER);

    init(p);
  };

  p.draw = () => {
    p.background(255);
    p.translate(p.width/2, p.height/2);
    p.scale(1, -1);
    overlap = false;

    squares.forEach(s => {
      s.update();
    })

    squares[1].ang += 0.01;

    checkcollision(p);

    drawAxis(p);

    squares.forEach(s => {
      s.draw();
    })

  };

  p.keyPressed = () => {
    handleKeyPressed(p.key);
  }

  p.keyReleased = () => {
    handleKeyReleased(p.key);
  }


};

new p5(sketch);


function init(p) {
  squares.push(new Rect(p, -100, 0, 60, 60, p.color(13, 225, 32)));

  squares.push(new Rect(p, 100, 0, 60, 60, p.color(22, 34, 212)));
}

function checkcollision(p) {
  for (let i=0; i<squares.length-1; i++) {
    for (let j=i+1; j<squares.length; j++) {
      let [norm, dist] = sat(p, squares[i].getCornerCoor(), squares[j].getCornerCoor(), squares[i].pos, squares[j].pos);

      if (norm !== null) {
        squares[i].activated = true;
        squares[j].activated = true;
        overlap = true;
      }
    }
  }
}


function drawAxis(p5) {
  // bot, left line
  let botLine1 = p5.createVector(- p5.width / 2  + 20, -p5.height / 2 + 20);
  let botLine2 = p5.createVector(p5.width / 2  - 20, -p5.height / 2 + 20);

  let rightLine1 = p5.createVector(p5.width / 2  - 20, -p5.height / 2 + 20);
  let rightLine2 = p5.createVector(p5.width / 2  - 20, p5.height / 2 - 20);
  drawLine(p5, botLine1, botLine2);
  drawLine(p5, rightLine1, rightLine2);

  squares.forEach((sq, idx) => {
    let color;
    let minH = 1e6;
    let maxH = -1e6;
    let minHPoint;
    let maxHPoint;

    let minV = 1e6;
    let maxV = -1e6;
    let minVPoint;
    let maxVPoint;

    sq.getCornerCoor().forEach(c => {
      color = idx == 0? p5.color(3, 255, 3) : p5.color(2, 2, 255);

      let scale = projectPoint(p5, p5.createVector(1, 0), sub(p5, c, botLine1));
      let temp = mult(p5, p5.createVector(1, 0), scale);
      //drawLine(p5, c, add(p5, botLine1, temp), 2, color);

      if (scale < minH) {
        minH = scale;
        minHPoint = c;
      }
      if (scale > maxH) {
        maxH = scale;
        maxHPoint = c;
      }

      let scale2 = projectPoint(p5, p5.createVector(0, 1), sub(p5, c, rightLine1));
      let temp2 = mult(p5, p5.createVector(0, 1), scale2);
      //drawLine(p5, c, add(p5, rightLine1, temp2), 2, color);

      if (scale2 < minV) {
        minV = scale2;
        minVPoint = c;
      }
      if (scale2 > maxV) {
        maxV = scale2;
        maxVPoint = c;
      }
    })

    color = idx == 0? p5.color(3, 255, 3, 40) : p5.color(2, 2, 255, 40);
    // draw left quad shadow
    let temp = add(p5, botLine1, mult(p5, p5.createVector(1, 0), maxH));
    let temp2 = add(p5, botLine1, mult(p5, p5.createVector(1, 0), minH));
    p5.fill(color);
    p5.quad(minHPoint.x, minHPoint.y, maxHPoint.x, maxHPoint.y, temp.x, temp.y, temp2.x, temp2.y);
    drawLine(p5, add(p5, botLine1, mult(p5, p5.createVector(1, 0), minH)), add(p5, botLine1, mult(p5, p5.createVector(1, 0), maxH)), 2, color);

    // draw right quad shadow
    temp = add(p5, rightLine1, mult(p5, p5.createVector(0, 1), maxV));
    temp2 = add(p5, rightLine1, mult(p5, p5.createVector(0, 1), minV));
    p5.fill(color);
    p5.quad(minVPoint.x, minVPoint.y, maxVPoint.x, maxVPoint.y, temp.x, temp.y, temp2.x, temp2.y);
    drawLine(p5, add(p5, rightLine1, mult(p5, p5.createVector(0, 1), minV)), add(p5, rightLine1, mult(p5, p5.createVector(0, 1), maxV)), 2, color);

  })
}

function drawLine(p5, p1, p2, weight=2, color="red") {
  p5.strokeWeight(weight);
  p5.stroke(color);
  p5.line(p1.x, p1.y, p2.x, p2.y);
  p5.strokeWeight(1);
  p5.stroke("black");
}


function sat(p5, vertices1, vertices2, center1, center2) {
  let dist = 1e12;
  let norm;

  for (let i=0; i<vertices1.length; i++) {
    let edge1 = sub(p5, vertices1[i], vertices1[(i+1)%vertices1.length]);
    let axis = p5.createVector(-edge1.y, edge1.x);
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
    let edge2 = sub(p5, vertices2[i], vertices2[(i+1)%vertices2.length]);
    let axis = p5.createVector(-edge2.y, edge2.x);
    
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

  let vBA = sub(p5, center2, center1);

  if (dot(p5, vBA, norm) > 0) {
    norm = mult(p5, norm, -1);
  }

  return [norm, dist];
}

function projectPoint(p5, axis, pt) {
  return dot(p5, axis, pt);
}

function project(p5, axis, pts) {
  let min = 1e12;
  let max = -1e12;
  for (let i=0; i<pts.length; i++) {
    let res = dot(p5, axis, pts[i])
    max = Math.max(res, max);
    min = Math.min(res, min);
  }
  return [min, max];
}

function handleKeyPressed(key) {
  let mag = 8;
  switch (key) {
    case "a":
      squares[0].vel.x -= mag;
      break;
    case "d":
      squares[0].vel.x += mag;
      break;
    case "w":
      squares[0].vel.y += mag;
      break;
    case "s":
      squares[0].vel.y -= mag;
      break;
    default:
      break;
  }
}


function handleKeyReleased(key) {
  switch (key) {
    case "a":
      squares[0].vel.x = 0;
      break;
    case "d":
      squares[0].vel.x = 0;
      break;
    case "w":
      squares[0].vel.y = 0;
      break;
    case "s":
      squares[0].vel.y = 0;
      break;
    default:
      break;
  }
}