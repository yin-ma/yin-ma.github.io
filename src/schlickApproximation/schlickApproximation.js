let controllerValue = document.querySelectorAll(".controller-value");
let controllerContent = document.querySelectorAll(".controller-value + p");
let inAngleController = document.querySelector(".controller-angle");
let theta = document.querySelector(".controller-angle + p");

let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
ctx.setTransform(1,0,0,-1,0,canvas.height);
ctx.translate(canvasWidth/2, canvasHeight/2);

let n1 = 1;
let n2 = 1.33;
let origin = {x: 0, y: 0};
let inPoint = {x: 0, y: canvasHeight/2 - 50};
let inAngle = Math.PI / 4;
let reflectedPoint = {x: 0, y: canvasHeight/2 - 50};
let refractedPoint = {x: 0, y: -canvasHeight/2 + 50};
let totalInternalReflection = false;

render();

controllerValue.forEach((e, idx) => {
  e.addEventListener("input", event => {
    let v = event.target.value / 1000;
    controllerContent[idx].innerHTML = `${v.toFixed(2)}`;
    if (idx == 0) {
      n1 = v;
    } else {
      n2 = v;
    }
    render();
  })
})

inAngleController.addEventListener("input", event => {
  let v = event.target.value / 1000;
  theta.innerHTML = `${v.toFixed(2)}`;
  inAngle = v;
  render();
  console.log(schlick());
})


function render() {
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);

  let reflectedRay = refract(refractedPoint);
  let color = "rgba(1.0, 0, 0, 1.0)";
  let reflectance = schlick();

  drawAxis();
  drawArrow(rotate(inPoint, inAngle), origin, color);

  if (totalInternalReflection) {
    color = `rgba(1.0, 0, 0, 1.0)`;
  } else {
    color = `rgba(1.0, 0, 0, ${reflectance})`;
  }

  drawArrow(origin, reflect(rotate(inPoint, inAngle)), color);
  if (!totalInternalReflection) {
    color = `rgba(1.0, 0, 0, ${1.0 - reflectance})`;
    drawArrow(origin, reflectedRay, color);
  } 
    
}

function schlick() {
  let ri = n1 / n2;
  let f_0 = (ri - 1) / (ri + 1);
  f_0 = f_0 * f_0;
  let F = f_0 + (1 - f_0) * Math.pow((1 - Math.cos(inAngle)), 5);
  return F;
}

function reflect(pt) {
  return {x: -pt.x, y: pt.y};
}

function refract(pt) {
  let sin_ri = n1 / n2 * Math.sin(inAngle);
  if (Math.abs(sin_ri) > 1) {
    totalInternalReflection = true;
    return {x: 0, y: 0};
  } 

  totalInternalReflection = false;
  let rAngle = Math.asin(sin_ri);
  return rotate(pt, rAngle);
}

function rotate(pt, ang) {
  let ca = Math.cos(ang);
  let sa = Math.sin(ang);
  let tempX = ca * pt.x - sa * pt.y;
  let tempY = sa * pt.x + ca * pt.y;
  return {x: tempX, y:tempY};
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
  drawLine(scale(add(p1, p2), 0.5), subtract(scale(add(p1, p2), 0.5), {x: Math.cos(Math.atan2(vec.y, vec.x)-arrowAngle)*arrowSize, y: Math.sin(Math.atan2(vec.y, vec.x)-arrowAngle)*arrowSize}), color);
  drawLine(scale(add(p1, p2), 0.5), subtract(scale(add(p1, p2), 0.5), {x: Math.cos(Math.atan2(vec.y, vec.x)+arrowAngle)*arrowSize, y: Math.sin(Math.atan2(vec.y, vec.x)+arrowAngle)*arrowSize}), color);
}

function drawLine(p1, p2, color="black") {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawAxis() {
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.beginPath();
  ctx.moveTo(-canvasWidth/2 + 40, 0);
  ctx.lineTo(canvasWidth/2 - 40, 0);
  ctx.stroke();

  ctx.moveTo(0, canvasHeight / 2 - 50);
  ctx.lineTo(0, 0);
  ctx.stroke();

}
