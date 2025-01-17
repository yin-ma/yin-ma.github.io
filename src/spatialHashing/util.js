function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dot(p5, v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

function sub(p5, v1, v2) {
  return p5.createVector(v1.x - v2.x, v1.y - v2.y);
}

function add(p5, v1, v2) {
  return p5.createVector(v1.x + v2.x, v1.y + v2.y);
}

function mult(p5, v1, t) {
  return p5.createVector(v1.x * t, v1.y * t);
}

function sqLen(p5, v) {
  return v.x * v.x + v.y * v.y;
}

function rotateAbove(p5, v1, v2, ang) {
  let ca = Math.cos(ang);
  let sa = Math.sin(ang);

  let x = v1.x - v2.x;
  let y = v1.y - v2.y;

  let newX = ca * x - sa * y;
  let newY = sa * x + ca * y;

  newX += v2.x;
  newY += v2.y;

  return p5.createVector(newX, newY);
}


function getIntersection(p5, A, B, C, D) {
  let bottom = (A.x - B.x) * (C.y - D.y) - (A.y - B.y) * (C.x - D.x);

  if (bottom === 0) return null;

  let ttop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  let utop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  let AB = sub(p5, B, A);

  let t = ttop / bottom;
  let u = utop / bottom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return add(p5, A, mult(p5, AB, t));
  }
  return null
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

function projectCircle(p5, axis, c) {
  let points = [];
  points.push(add(p5, c.pos, mult(p5, axis, c.radius)));
  points.push(sub(p5, c.pos, mult(p5, axis, c.radius)));

  return project(p5, axis, points);
}

function closestPoint(p5, org, vertices) {
  let pt;
  let dist = 1e12;

  for (let i=0; i<vertices.length; i++) {
    let tempLen = sqLen(p5, sub(p5, vertices[i], org));
    if (tempLen < dist) {
      dist = tempLen;
      pt = vertices[i];
    }
  }
  return pt;
}