function getIntersection(A, B, C, D) {
  /*
    line Segment AB and line Segment CD
    return the point intersected and scale value t(for ab) and u(for cd)
  */
  let bottom = (A.x - B.x) * (C.y - D.y) - (A.y - B.y) * (C.x - D.x);

  if (bottom === 0) return null;

  let ttop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  let utop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  let AB = subtract(B, A);

  let t = ttop / bottom;
  let u = utop / bottom;

  if (t >= 0 && t < 1 && u >= 0 && u < 1) {
    return [add(A, scale(AB, t)), t, u];
  }
  return null
}


function lerp(a, b, t) {
  return a + (b - a) * t;
}


function projectPointToSegment(P, A, B) {
  // project point P to segment AB
  // t is the scale factor for AB from point A to B
  let AB = subtract(B, A);
  let AP = subtract(P, A);
  let t = dot(AP, normalize(AB)) / len(AB);
  let proP = add(A, scale(AB, t));
  return [proP, t];
}


function dot(p1, p2) {
  return p1.x*p2.x + p1.y*p2.y;
}

function normalize(p) {
  return {x: p.x / len(p), y: p.y / len(p)};
}

function len(p) {
  return Math.hypot(p.x, p.y);
}

function scale(p, t) {
  return {x: p.x*t, y: p.y*t};
}

function add(p1, p2) {
  return {x: p1.x + p2.x, y: p1.y + p2.y};
}

function subtract(p1, p2) {
  // head, tail
  // p1 is the arrow side
  // from p2 to p1
  return {x: p1.x - p2.x, y: p1.y - p2.y};
}


function drawLine(ctx, p1, p2, color="black") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}


function drawCircle(ctx, x, y, radius, color="black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI*2);
  ctx.fill();
}