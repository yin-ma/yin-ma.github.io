let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
ctx.setTransform(1,0,0,-1,0,canvas.height);
ctx.translate(canvasWidth/2, canvasHeight/2);

let perspectiveMatrix = getPerspectiveMatrix(-1, 1, -1, 1, 1, 100);
let translationMatrix = getTranslationMatrix();
let rotateXMatrix = getTranslationMatrix();
let rotateYMatrix = getTranslationMatrix();
let rotateZMatrix = getTranslationMatrix();
let lines = getLinesCube(-1, -1, -3, 1);
let rotationPoint = [0, -1, -6, 1];

let translateXSlider = document.querySelector(".translateX-slider");
let translateYSlider = document.querySelector(".translateY-slider");
let translateZSlider = document.querySelector(".translateZ-slider");
let rotateXSlider = document.querySelector(".rotateX-slider");
let rotateYSlider = document.querySelector(".rotateY-slider");
let rotateZSlider = document.querySelector(".rotateZ-slider");

render();

translateXSlider.addEventListener("input", event => {
  translationMatrix[0][3] = parseInt(event.target.value)/10000;
})

translateYSlider.addEventListener("input", event => {
  translationMatrix[1][3] = parseInt(event.target.value)/10000;
})

translateZSlider.addEventListener("input", event => {
  translationMatrix[2][3] = parseInt(event.target.value)/10000;
})

rotateXSlider.addEventListener("input", event => {
  rotateXMatrix = getRotationMatrixX(parseInt(event.target.value)/1000);
})

rotateYSlider.addEventListener("input", event => {
  rotateYMatrix = getRotationMatrixY(parseInt(event.target.value)/1000);
})

rotateZSlider.addEventListener("input", event => {
  rotateZMatrix = getRotationMatrixZ(parseInt(event.target.value)/1000);
})


function render() {
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  let transformedLines = lines;
  transformedLines = lines.map(l => {
    return [
      matVecMul(translationMatrix, l[0]),
      matVecMul(translationMatrix, l[1])
    ];
  });
  transformedLines = transformedLines.map(l => {
    return [
      rotationAbovePoint(rotateXMatrix, l[0], rotationPoint),
      rotationAbovePoint(rotateXMatrix, l[1], rotationPoint),
    ]
  });
  transformedLines = transformedLines.map(l => {
    return [
      rotationAbovePoint(rotateYMatrix, l[0], rotationPoint),
      rotationAbovePoint(rotateYMatrix, l[1], rotationPoint),
    ]
  });
  transformedLines = transformedLines.map(l => {
    return [
      rotationAbovePoint(rotateZMatrix, l[0], rotationPoint),
      rotationAbovePoint(rotateZMatrix, l[1], rotationPoint),
    ]
  });
  drawGround();
  drawProjectedPoint(rotationPoint);
  drawLines(transformedLines);
  requestAnimationFrame(render);
}

function rotationAbovePoint(m, target, ref) {
  let trans = getTranslationMatrix(-ref[0], -ref[1], -ref[2]);
  let inverseTrans = getTranslationMatrix(ref[0], ref[1], ref[2]);
  let res;
  res = matVecMul(trans, target);
  res = matVecMul(m, res);
  res = matVecMul(inverseTrans, res);
  return res;
}

function drawProjectedPoint(pt) {
  let ppt = matVecMul(perspectiveMatrix, pt);
  drawCircle(ppt[0]/ppt[3]*canvasWidth/2, ppt[1]/ppt[3]*canvasHeight/2, 4, "green");
}


function drawLines(inputLines) {
  inputLines.map(l => {
    let p1 = matVecMul(perspectiveMatrix, l[0]);
    let p2 = matVecMul(perspectiveMatrix, l[1]);
    drawCircle(p1[0]/p1[3]*canvasWidth/2, p1[1]/p1[3]*canvasHeight/2, 3, "orange");
    drawLine(
      p1[0]/p1[3]*canvasWidth/2,
      p1[1]/p1[3]*canvasHeight/2,
      p2[0]/p2[3]*canvasWidth/2,
      p2[1]/p2[3]*canvasHeight/2,
      1,
      "orange"
    )
  })
}

function getLinesCube(x, y, z, l) {
  return [
    [[x, y, z, 1], [x+l, y, z, 1]],
    [[x+l, y, z, 1], [x+l, y, z-l, 1]],
    [[x+l, y, z-l, 1], [x, y, z-l, 1]],
    [[x, y, z-l, 1], [x, y, z, 1]],

    [[x, y, z, 1], [x, y+l, z, 1]],
    [[x+l, y, z, 1], [x+l, y+l, z, 1]],
    [[x+l, y, z-l, 1], [x+l, y+l, z-l, 1]],
    [[x, y, z-l, 1], [x, y+l, z-l, 1]],

    [[x, y+l, z, 1], [x+l, y+l, z, 1]],
    [[x+l, y+l, z, 1], [x+l, y+l, z-l, 1]],
    [[x+l, y+l, z-l, 1], [x, y+l, z-l, 1]],
    [[x, y+l, z-l, 1], [x, y+l, z, 1]],
  ]
}


function drawGround() {
  // horizontal line
  for (let d=1; d<20; d++) {
    let p1 = [-100, -1, -d, 1];
    let p2 = [100, -1, -d, 1];
    let perspectP1 = matVecMul(perspectiveMatrix, p1);
    let perspectP2 = matVecMul(perspectiveMatrix, p2);
    drawLine(
      perspectP1[0]/perspectP1[3]*canvasWidth/2,
      perspectP1[1]/perspectP1[3]*canvasHeight/2,
      perspectP2[0]/perspectP2[3]*canvasWidth/2,
      perspectP2[1]/perspectP2[3]*canvasHeight/2,
      1,
      "black"
    );
  }

  // vertical line
  for (let i=-20; i<20; i++) {
    let p1 = [i, -1, -1, 1];
    let p2 = [i, -1, -20, 1];
    let perspectP1 = matVecMul(perspectiveMatrix, p1);
    let perspectP2 = matVecMul(perspectiveMatrix, p2);
    drawLine(
      perspectP1[0]/perspectP1[3]*canvasWidth/2,
      perspectP1[1]/perspectP1[3]*canvasHeight/2,
      perspectP2[0]/perspectP2[3]*canvasWidth/2,
      perspectP2[1]/perspectP2[3]*canvasHeight/2,
      1,
      "black"
    );
  }
}

function getRotationMatrixX(theta) {
  let m = getNewMatrix(4, 4);
  m[0][0] = 1;
  m[1][1] = Math.cos(theta);
  m[1][2] = Math.sin(theta);
  m[2][1] = -Math.sin(theta);
  m[2][2] = Math.cos(theta);
  m[3][3] = 1;
  return m;
}

function getRotationMatrixY(theta) {
  let m = getNewMatrix(4, 4);
  m[0][0] = Math.cos(theta);
  m[0][2] = -Math.sin(theta);
  m[1][1] = 1;
  m[2][0] = Math.sin(theta);
  m[2][2] = Math.cos(theta);
  m[3][3] = 1;
  return m;
}


function getRotationMatrixZ(theta) {
  let m = getNewMatrix(4, 4);
  m[0][0] = Math.cos(theta);
  m[0][1] = -Math.sin(theta);
  m[1][0] = Math.sin(theta);
  m[1][1] = Math.cos(theta);
  m[2][2] = 1;
  m[3][3] = 1;
  return m;
}

function getTranslationMatrix(x=0, y=0, z=0) {
  let res = getNewMatrix(4, 4);
  res[0][0] = 1;
  res[1][1] = 1;
  res[2][2] = 1;
  res[3][3] = 1;
  res[0][3] = x;
  res[1][3] = y;
  res[2][3] = z;
  return res;
}

function getPerspectiveMatrix(l, r, b, t, n, f) {
  // left, right, bottom, top, near, far
  let res = getNewMatrix(4, 4);
  res[0][0] = 2*n / (r-l);
  res[0][2] = (r+l) / (r-l);
  res[1][1] = 2*n / (t-b);
  res[1][2] = (t+b) / (t-b);
  res[2][2] = - (f+n) / (f-n);
  res[2][3] = - 2 * f * n / (f-n);
  res[3][2] = -1;
  return res;
}

function getNewMatrix(nr, nc) {
  return new Array(nr).fill(0).map(v => new Array(nc).fill(0));
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

function drawCircle(x, y, r=3, color="black") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
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