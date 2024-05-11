let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
ctx.translate(canvasWidth/2, canvasHeight/2);

let ax = document.querySelector(".vecAx");
let ay = document.querySelector(".vecAy");
let bx = document.querySelector(".vecBx");
let by = document.querySelector(".vecBy");
let cx = document.querySelector(".vecCx");
let cy = document.querySelector(".vecCy");

let aIsActive = false;
let bIsActive = false;
let cIsActive = false;


let m = {x: 0, y: 0};
let origin = {x: 0, y: 0};
let a = {x: -200, y:-200};
let b = {x: 200, y:200};
let c = {x: -200, y: 200};

render();


function render() {
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  drawAxis();

  drawArrow(c, m);
  drawArrow(a, b);
  drawText(a.x, a.y, "A");
  drawText(b.x, b.y, "B");
  drawText(c.x, c.y, "C");
  drawText(m.x, m.y, "M");

  let I = getIntersection(a, b, c, m);
  if (I !== null) {
    drawCircle(I.x, I.y, 3);
  }
  requestAnimationFrame(render);
}

canvas.addEventListener("mousedown", () => {
  if (isIndistant(a, m)) {
    aIsActive = true;
    return;
  }
  if (isIndistant(b, m)) {
    bIsActive = true;
    return;
  }
  if (isIndistant(c, m)) {
    cIsActive = true;
    return;
  }
})

canvas.addEventListener("mouseup", () => {
  aIsActive = false;
  bIsActive = false;
  cIsActive = false;
})

function isIndistant(a, b) {
  return Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2) < Math.pow(20, 2)
}

canvas.addEventListener("mousemove", event => {
  m.x = event.offsetX - canvasWidth/2;
  m.y = event.offsetY - canvasHeight/2;

  if (aIsActive) {
    ax.value = m.x;
    ay.value = m.y;
    a.x = m.x;
    a.y = m.y;
  }
  if (bIsActive) {
    bx.value = m.x;
    by.value = m.y;
    b.x = m.x;
    b.y = m.y;
  }
  if (cIsActive) {
    cx.value = m.x;
    cy.value = m.y;
    c.x = m.x;
    c.y = m.y;
  }
})

ax.addEventListener("input", () => {
  a.x = parseInt(ax.value);
})

ay.addEventListener("input", () => {
  a.y = parseInt(ay.value);
})

bx.addEventListener("input", () => {
  b.x = parseInt(bx.value);
})

by.addEventListener("input", () => {
  b.y = parseInt(by.value);
})

cx.addEventListener("input", () => {
  c.x = parseInt(cx.value);
})

cy.addEventListener("input", () => {
  c.y = parseInt(cy.value);
})

function drawText(x, y, label) {
  ctx.beginPath();
  ctx.font = "bold 14px Arial";
  ctx.fillText(label, x, y);
}

function getIntersection(A, B, C, D) {
  let bottom = (A.x - B.x) * (C.y - D.y) - (A.y - B.y) * (C.x - D.x);

  if (bottom === 0) return null;

  let ttop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  let utop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  let AB = subtract(B, A);

  let t = ttop / bottom;
  let u = utop / bottom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return add(A, scale(AB, t));
  }
  return null
}


function projectPointToSegment(P, A, B) {
  // project point P to segment AB
  let AB = subtract(B, A);
  let AP = subtract(P, A);
  let t = dot(AP, normalize(AB)) / len(AB);
  let proP = add(A, scale(AB, t));
  return [proP, t];
}

function project(p1, p2) {
  // p1 project to p2
  return scale(normalize(p2), dot(p1, normalize(p2)));
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


function drawArrow(p1, p2, color="black") {
  let arrowSize = 10;
  let arrowAngle = Math.PI/8;
  let vec = subtract(p2, p1);
  drawLine(p1, p2, color);
  drawLine(p2, subtract(p2, {x: Math.cos(Math.atan2(vec.y, vec.x)-arrowAngle)*arrowSize, y: Math.sin(Math.atan2(vec.y, vec.x)-arrowAngle)*arrowSize}))
  drawLine(p2, subtract(p2, {x: Math.cos(Math.atan2(vec.y, vec.x)+arrowAngle)*arrowSize, y: Math.sin(Math.atan2(vec.y, vec.x)+arrowAngle)*arrowSize}))
}


function drawLine(p1, p2, color="black") {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}


function drawAxis() {
  ctx.beginPath();
  ctx.strokeStyle ="rgba(0, 0, 0, 0.2)";
  ctx.setLineDash([5, 4]);
  ctx.moveTo(0, -canvasHeight/2);
  ctx.lineTo(0, canvasHeight/2);
  ctx.moveTo(-canvasWidth/2, 0);
  ctx.lineTo(canvasWidth/2, 0);
  ctx.stroke();
  ctx.setLineDash([]);
}


function drawCircle(x, y, radius, color="black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI*2);
  ctx.stroke();
  ctx.fill();
}