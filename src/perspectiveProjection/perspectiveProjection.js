let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
ctx.translate(canvasWidth/2, canvasHeight/2);

let perspectiveMatrix = getPerspectiveMatrix(1, 1, Math.PI/2, 1, 100);
let points = [
  [1, 0, -8, 1], 
  [1, 3, -8, 1], 
  [4, 3, -8, 1], 
  [4, 0, -8, 1], 
  [1, 0, -10, 1], 
  [1, 3, -10, 1], 
  [4, 3, -10, 1], 
  [4, 0, -10, 1]
];

let lines = [
  [[1, 0, -8, 1], [1, 3, -8, 1]],
  [[1, 3, -8, 1], [4, 3, -8, 1]],
  [[4, 3, -8, 1], [4, 0, -8, 1]],
  [[4, 0, -8, 1], [1, 0, -8, 1]],
  [[1, 0, -11, 1], [1, 3, -11, 1]],
  [[1, 3, -11, 1], [4, 3, -11, 1]],
  [[4, 3, -11, 1], [4, 0, -11, 1]],
  [[4, 0, -11, 1], [1, 0, -11, 1]],
  [[1, 0, -8, 1], [1, 0, -11, 1]],
  [[1, 3, -8, 1], [1, 3, -11, 1]],
  [[4, 3, -8, 1], [4, 3, -11, 1]],
  [[4, 0, -8, 1], [4, 0, -11, 1]],

  [[4, 0, -8, 1], [4, 3, -8, 1]],
  [[4, 3, -8, 1], [7, 3, -8, 1]],
  [[7, 3, -8, 1], [7, 0, -8, 1]],
  [[7, 0, -8, 1], [4, 0, -8, 1]],
  [[4, 0, -11, 1], [4, 3, -11, 1]],
  [[4, 3, -11, 1], [7, 3, -11, 1]],
  [[7, 3, -11, 1], [7, 0, -11, 1]],
  [[7, 0, -11, 1], [4, 0, -11, 1]],
  [[4, 0, -8, 1], [4, 0, -11, 1]],
  [[4, 3, -8, 1], [4, 3, -11, 1]],
  [[7, 3, -8, 1], [7, 3, -11, 1]],
  [[7, 0, -8, 1], [7, 0, -11, 1]],

  [[1, 3, -8, 1], [1, 6, -8, 1]],
  [[1, 6, -8, 1], [4, 6, -8, 1]],
  [[4, 6, -8, 1], [4, 3, -8, 1]],
  [[4, 3, -8, 1], [1, 3, -8, 1]],
  [[1, 3, -11, 1], [1, 6, -11, 1]],
  [[1, 6, -11, 1], [4, 6, -11, 1]],
  [[4, 6, -11, 1], [4, 3, -11, 1]],
  [[4, 3, -11, 1], [1, 3, -11, 1]],
  [[1, 3, -8, 1], [1, 3, -11, 1]],
  [[1, 6, -8, 1], [1, 6, -11, 1]],
  [[4, 6, -8, 1], [4, 6, -11, 1]],
  [[4, 3, -8, 1], [4, 3, -11, 1]],

  [[4, 3, -8, 1], [4, 6, -8, 1]],
  [[4, 6, -8, 1], [7, 6, -8, 1]],
  [[7, 6, -8, 1], [7, 3, -8, 1]],
  [[7, 3, -8, 1], [4, 3, -8, 1]],
  [[4, 3, -11, 1], [4, 6, -11, 1]],
  [[4, 6, -11, 1], [7, 6, -11, 1]],
  [[7, 6, -11, 1], [7, 3, -11, 1]],
  [[7, 3, -11, 1], [4, 3, -11, 1]],
  [[4, 3, -8, 1], [4, 3, -11, 1]],
  [[4, 6, -8, 1], [4, 6, -11, 1]],
  [[7, 6, -8, 1], [7, 6, -11, 1]],
  [[7, 3, -8, 1], [7, 3, -11, 1]],

  //
  [[1, 0, -11, 1], [1, 3, -11, 1]],
  [[1, 3, -11, 1], [4, 3, -11, 1]],
  [[4, 3, -11, 1], [4, 0, -11, 1]],
  [[4, 0, -11, 1], [1, 0, -11, 1]],
  [[1, 0, -14, 1], [1, 3, -14, 1]],
  [[1, 3, -14, 1], [4, 3, -14, 1]],
  [[4, 3, -14, 1], [4, 0, -14, 1]],
  [[4, 0, -14, 1], [1, 0, -14, 1]],
  [[1, 0, -11, 1], [1, 0, -14, 1]],
  [[1, 3, -11, 1], [1, 3, -14, 1]],
  [[4, 3, -11, 1], [4, 3, -14, 1]],
  [[4, 0, -11, 1], [4, 0, -14, 1]],

  [[4, 0, -11, 1], [4, 3, -11, 1]],
  [[4, 3, -11, 1], [7, 3, -11, 1]],
  [[7, 3, -11, 1], [7, 0, -11, 1]],
  [[7, 0, -11, 1], [4, 0, -11, 1]],
  [[4, 0, -14, 1], [4, 3, -14, 1]],
  [[4, 3, -14, 1], [7, 3, -14, 1]],
  [[7, 3, -14, 1], [7, 0, -14, 1]],
  [[7, 0, -14, 1], [4, 0, -14, 1]],
  [[4, 0, -11, 1], [4, 0, -14, 1]],
  [[4, 3, -11, 1], [4, 3, -14, 1]],
  [[7, 3, -11, 1], [7, 3, -14, 1]],
  [[7, 0, -11, 1], [7, 0, -14, 1]],

  [[1, 3, -11, 1], [1, 6, -11, 1]],
  [[1, 6, -11, 1], [4, 6, -11, 1]],
  [[4, 6, -11, 1], [4, 3, -11, 1]],
  [[4, 3, -11, 1], [1, 3, -11, 1]],
  [[1, 3, -14, 1], [1, 6, -14, 1]],
  [[1, 6, -14, 1], [4, 6, -14, 1]],
  [[4, 6, -14, 1], [4, 3, -14, 1]],
  [[4, 3, -14, 1], [1, 3, -14, 1]],
  [[1, 3, -11, 1], [1, 3, -14, 1]],
  [[1, 6, -11, 1], [1, 6, -14, 1]],
  [[4, 6, -11, 1], [4, 6, -14, 1]],
  [[4, 3, -11, 1], [4, 3, -14, 1]],

  [[4, 3, -11, 1], [4, 6, -11, 1]],
  [[4, 6, -11, 1], [7, 6, -11, 1]],
  [[7, 6, -11, 1], [7, 3, -11, 1]],
  [[7, 3, -11, 1], [4, 3, -11, 1]],
  [[4, 3, -14, 1], [4, 6, -14, 1]],
  [[4, 6, -14, 1], [7, 6, -14, 1]],
  [[7, 6, -14, 1], [7, 3, -14, 1]],
  [[7, 3, -14, 1], [4, 3, -14, 1]],
  [[4, 3, -11, 1], [4, 3, -14, 1]],
  [[4, 6, -11, 1], [4, 6, -14, 1]],
  [[7, 6, -11, 1], [7, 6, -14, 1]],
  [[7, 3, -11, 1], [7, 3, -14, 1]]
]

animate2(0);

function animate2(i) {
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  let ls = lines;
  ls = ls.map(l => {
    return rotateAbove(getRotationMatrixX(i/67), l, 0, 0, -15);
  })
  ls = ls.map(l => {
    return rotateAbove(getRotationMatrixY(i/77), l, 0, 0, -15);
  })
  ls = ls.map(l => {
    return rotateAbove(getRotationMatrixZ(i/512), l, 0, 0, -15);
  })

  ls = ls.map(l => {
    return transformPoints(perspectiveMatrix, l);
  })
  
  ls = ls.map(l => {
    return [toNDC(l[0]), toNDC(l[1])];
  })

  ls.map(l => {
    drawLine(l[0][0]*canvasWidth/2, l[0][1]*canvasHeight/2, l[1][0]*canvasWidth/2, l[1][1]*canvasHeight/2);
  })

  requestAnimationFrame(() => animate2(++i));
}

function animate1(i) {
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  drawCircle(0, 0, 2, "red");
  let r1 = points;
  r1 = rotateAbove(getRotationMatrixX(i/100), r1, 0, 0, -15);
  r1 = rotateAbove(getRotationMatrixY(i/125), r1, 0, 0, -15);
  r1 = rotateAbove(getRotationMatrixZ(i/75), r1, 0, 0, -15);
  r1 = transformPoints(perspectiveMatrix, r1);
  r1.map(v => toNDC(v)).forEach(p => {
    drawCircle(p[0]*canvasWidth/2, p[1]*canvasHeight/2);
  })
  i++;
  requestAnimationFrame(() => animate1(i));
}

function rotateAbove(m, p, x, y, z) {
  return transformPoints(m, p.map(v => {
    return [v[0] - x, v[1] - y, v[2] - z, v[3]];
  })).map(v => {
    return [v[0] + x, v[1] + y, v[2] + z, v[3]];
  });
}


function toNDC(v) {
  if (v.length !== 4) {
    return v;
  }

  else if (v.length === 4) {
    return [v[0]/v[3], v[1]/v[3], v[2]/v[3]];
  }
}


function transformPoints(m, p) {
  let r = [];
  for (let v of p) {
    r.push(matVecMul(m, v));
  }
  return r;
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

function getPerspectiveMatrix(w, h, theta, n=1, f=100) {
  let m = getNewMatrix(4, 4);
  let ratio = w / h;
  let tan = Math.tan(theta/2);
  m[0][0] = 1 / (ratio * tan);
  m[1][1] = tan;
  m[2][2] = - (f + n) / (f - n);
  m[2][3] = - 2 * f * n / (f - n);
  m[3][2] = -1;
  return m;
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