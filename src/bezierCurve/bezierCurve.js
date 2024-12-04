let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 450;
ctx.setTransform(1,0,0,-1,0,canvas.height);

let pts = [];
let start = createVector(50, 20);
let cp1 = createVector(230, 30);
let cp2 = createVector(150, 80);
let end = createVector(250, 100);
pts.push(start, cp1, cp2, end);
draw();

let isMoving = false;
let holdingPoint = -1;

function draw() {
  // draw bezier curve and control pts
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLine(pts[0], pts[1], "#aaa");
  drawLine(pts[2], pts[3], "#aaa");

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  ctx.bezierCurveTo(pts[1].x, pts[1].y, pts[2].x, pts[2].y, pts[3].x, pts[3].y);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();

  drawCircle(pts[0], 5, "green");
  drawCircle(pts[3], 5, "red");
  drawCircle(pts[1], 5, "blue");
  drawCircle(pts[2], 5, "blue");

}


canvas.addEventListener("mousedown", event => {
  let idx = hoveringPoint(createVector(event.offsetX, canvas.height - event.offsetY));
  if (idx === -1) return;
  holdingPoint = idx;
  isMoving = true;
})

canvas.addEventListener("mouseup", event => {
  isMoving = false;
  holdingPoint = -1;
})

canvas.addEventListener("mousemove", event => {
  let idx = hoveringPoint(createVector(event.offsetX, canvas.height - event.offsetY));
  canvas.style.cursor = idx === -1 ? "default" : "grab";
  
  if (!isMoving) return;
  if (holdingPoint === idx) {
    holdingPoint = idx;
    pts[idx] = createVector(event.offsetX, canvas.height - event.offsetY);
  } else {
    pts[holdingPoint] = createVector(event.offsetX, canvas.height - event.offsetY);
  }
  draw();
})


function hoveringPoint(mousePos) {
  let idx = -1;

  pts.forEach((pt, index) => {
    if (idx === -1 && lengthsquare(pt, createVector(mousePos.x, mousePos.y)) < 250) {
      idx = index;
    }
  })

  return idx;
}

function length(a, b) {
  return Math.sqrt(length(a, b));
}

function lengthsquare(a, b) {
  return (a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y);
}

function createVector(x, y) {
  return {x: x, y: y};
}

function cubicBezier(p0, p1, p2, p3, t) {
  let x = (1-t)*(1-t)*(1-t)*p0.x + 3*(1-t)*(1-t)*t*p1.x + 3*(1-t)*t*t*p2.x + t*t*t*p3.x;
  let y = (1-t)*(1-t)*(1-t)*p0.y + 3*(1-t)*(1-t)*t*p1.y + 3*(1-t)*t*t*p2.y + t*t*t*p3.y;

  return createVector(x, y);
}

function drawLine(p1, p2, color="black") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawCircle(p, radius, color="black") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
  ctx.fill();
}