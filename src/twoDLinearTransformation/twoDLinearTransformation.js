let matrixValue = document.querySelectorAll(".matrix-value");
let matrixElement = document.querySelectorAll(".matrix-value + p");
let matrixAngle = document.querySelector(".matrix-angle");
let matrixAngleElement = document.querySelector(".matrix-angle + p");

let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
ctx.setTransform(1,0,0,-1,0,canvas.height);
ctx.translate(canvasWidth/2, canvasHeight/2);


let rect = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}];
let transformationMatrix = getMatrix(3, 3);

render();

matrixValue.forEach((e, idx) => {
  e.addEventListener("input", event => {
    let mValue = parseInt(event.target.value)/1000;
    matrixElement[idx].innerHTML = `${mValue}`;
    transformationMatrix[Math.floor(idx/3)][idx%3] = mValue;
    render();
    drawRect(transformRect(transformationMatrix, rect));
  })
})

matrixAngle.addEventListener("input", event => {
  let v = event.target.value/1000;
  matrixAngleElement.innerHTML = v;
  matrixElement[0].innerHTML = Math.cos(v).toFixed(2);
  matrixElement[4].innerHTML = Math.cos(v).toFixed(2);
  matrixElement[1].innerHTML = -Math.sin(v).toFixed(2);
  matrixElement[3].innerHTML = Math.sin(v).toFixed(2);
  matrixValue[0].value = Math.cos(v)*1000;
  matrixValue[4].value = Math.cos(v)*1000;
  matrixValue[1].value = -Math.sin(v)*1000;
  matrixValue[3].value = -Math.sin(v)*1000;

  transformationMatrix[0][0] = Math.cos(v);
  transformationMatrix[1][1] = Math.cos(v);
  transformationMatrix[0][1] = -Math.sin(v);
  transformationMatrix[1][0] = Math.sin(v);
  render();
  drawRect(transformRect(transformationMatrix, rect));
})


function transformRect(m, rect) {
  let temp = []
  for (let r of rect) {
    temp.push(matVecMul(m, [r.x, r.y, 1]));
  }
  return temp.map(v => {
    return {x: v[0]/v[2], y:v[1]/v[2]};
  })
}

function getRotationMatrix(theta) {
  return [
    [Math.cos(theta), -Math.sin(theta), 0],
    [Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 1]
  ]
}

function getTranslationMatrix(dx, dy) {
  return [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0, 1]
  ]
}

function getScalingMatrix(s=1, t=1) {
  return [
    [s, 0, 0],
    [0, t, 0],
    [0, 0, 1]
  ]
}

function getMatrix(r, c) {
  let temp = new Array(r).fill(0).map(v => new Array(c).fill(0));
  for (let i=0; i<temp.length; i++) {
    for (let j=0; j<temp[0].length; j++) {
      if (i === j) {
        temp[i][j] = 1;
      }
    }
  }
  return temp;
}


function matVecMul(m, v) {
  if (m[0].length !== v.length) {
    throw "matrix col should match vector dimention";
  }

  let res = [];
  for (let r=0; r<m.length; r++) {
    let sum = 0;
    for (let c=0; c<m[0].length; c++) {
      sum += m[r][c] * v[c];
    }
    res.push(sum);
  }
  return res;
}
    

function render() {
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight)
  drawAxis();
  drawRect(rect);
}

function drawRect(r) {
  for (let i=0; i<r.length; i++) {
    drawCircle(r[i].x*100, r[i].y*100);
  }

  ctx.strokeStyle = "black";
  ctx.fillStyle = "rgba(127, 12, 136, 0.3)";
  ctx.beginPath();
  ctx.moveTo(r[0].x*100, r[0].y*100);
  for (let i=1; i<r.length; i++) {
    ctx.lineTo(r[i].x*100, r[i].y*100);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, width=3, color="black") {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawCircle(x, y, r=3, color="black") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.stroke();
  ctx.fill();
}

function drawAxis() {
  ctx.strokeStyle ="rgba(0, 0, 0, 0.4)";
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(-canvasWidth/2, 0);
  ctx.lineTo(canvasWidth/2, 0);
  ctx.moveTo(0, -canvasHeight/2);
  ctx.lineTo(0, canvasHeight/2);
  ctx.stroke();
  ctx.setLineDash([]);
}
