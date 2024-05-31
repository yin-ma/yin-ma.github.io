function getTranslationMatrix(dx, dy, dz) {
  let res = getIndentityMatrix(4);
  res[0][3] = dx;
  res[1][3] = dy;
  res[2][3] = dz;
  return res;
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

function getPerspectiveMatrix(w, h, theta, n=1, f=10) {
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

function getIndentityMatrix(n) {
  let res = getNewMatrix(n, n);
  for (let i=0; i<res.length; i++) {
    res[i][i] = 1;
  }
  return res;
}

function getNewMatrix(nr, nc) {
  return new Array(nr).fill(0).map(v => new Array(nc).fill(0));
}

function matMatMul(m1, m2) {
  if (m1[0].length !== m2.length) {
    throw "matrix should match dimention";
  }
  let res = new Array(m1.length).fill(0);
  res = res.map(v => new Array(m2[0].length).fill(0));

  for (let i=0; i<res.length; i++) {
    for (let j=0; j<res[0].length; j++) {
      let sum = 0;
      for (let k=0; k<m2.length ; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      res[i][j] = sum;
    }
  }
  return res;
}

function perpectiveMatVecMul(m, v) {
  let temp = matVecMul(m, v);
  return [temp[0]/temp[3], temp[1]/temp[3], temp[2]/temp[3]];
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

function crossProduct(a, b) {
  // 3d vector (x, y, z)
  let res = new Array(3).fill(0);
  res[0] = a[1] * b[2] - a[2] * b[1];
  res[1] = a[2] * b[0] - a[0] * b[2];
  res[2] = a[0] * b[1] - a[1] * b[0];
  return res;
}

function dotProduct(a, b) {
  if (a.length !== b.length) {
    throw "two given vector should have same dimention for dot Product";
  }
  let res = 0;
  for (let i=0; i<a.length; i++) {
    res += a[i] * b[i];
  }
  return res;
}

function vecSubtract(a, b) {
  // return vec ba
  let res = new Array(a.length);
  for (let i=0; i<a.length; i++) {
    res[i] = a[i] - b[i];
  }
  return res;
}