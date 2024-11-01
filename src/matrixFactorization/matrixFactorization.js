let targetMatrixElement = document.querySelector(".target-matrix");
let predictMatrixElement = document.querySelector(".predict-matrix");
let startBtn = document.querySelector(".start-btn");

let row = 4;
let col = 4;
let k = 2;

let targetMatrix = initRandomMatrix_int(row, col);
let predictMatrix = initZeroMatrix(row, col);

let p = initRandomMatrix_f(row, k);
let q = initRandomMatrix_f(col, k);

setMatrixHtml(targetMatrix, targetMatrixElement, "target");

startBtn.addEventListener("click", () => {
  matrixFactorization(targetMatrix, p, q, k);
  predictMatrix = matMatMul(p, transpose(q));

  setMatrixHtml(predictMatrix, predictMatrixElement, "predict"); 
  MathJax.typesetPromise();
})

function matrixFactorization(R, P, Q, k, steps=500, gamma=0.001, lambda=0.01) {
  for (let s=0; s<steps; s++) {
    for (let i=0; i<R.length; i++) {
      for (let j=0; j<R[0].length; j++) {
        if (R[i][j] <= 0) continue;

        e_ui = R[i][j] - dot(P[i], Q[j]);

        for (let a=0; a<k; a++) {
          P[i][a] = P[i][a] + gamma * (Q[j][a] * e_ui - P[i][a] * lambda);
          Q[j][a] = Q[j][a] + gamma * (P[i][a] * e_ui - Q[j][a] * lambda);
        }

      }
    }
  }
}

function multiply(m, t) {
  for (let i=0; i<m.length; i++) {
    for (let j=0; j<m[0].length; j++) {
      m[i][j] = m[i][j] * t;
    }
  }
  return m;
}

function dot(v1, v2) {
  let res = 0;
  for (let i=0; i<v1.length; i++) {
    res += v1[i] * v2[i];
  }
  return res;
}

function initRandomMatrix_f(row, col) {
  return new Array(row).fill(0).map(() => {
    return new Array(col).fill(0).map(() => (Math.random()));
  });
}

function initRandomMatrix_int(row, col) {
  return new Array(row).fill(0).map(() => new Array(col).fill(0).map(() => randInt(0, 5)));
}

function initZeroMatrix(row, col) {
  return new Array(row).fill(0).map(() => new Array(col).fill(0));
}

function setMatrixHtml(mat, element, str="target") {
  let temp = "";
  temp += `$$M_{${str}} = \\begin{bmatrix} `;
  for (let i=0; i<row; i++) {
    if ( i !== 0 ) {
      temp += "\\\\";
    }
    for (let j=0; j<col; j++) {
      if ( j !== col-1) {
        temp += `${mat[i][j].toFixed(2)} &`;
      } else {
        temp += `${mat[i][j].toFixed(2)}`;
      }
    }
  }
  temp += "\\end{bmatrix}$$";

  element.innerHTML = temp;
}

function transpose(m) {
  let r = m.length;
  let c = m[0].length;
  let res = initZeroMatrix(c, r);

  for (let i=0; i<r; i++) {
    for (let j=0; j<c; j++) {
      res[j][i] = m[i][j];
    }
  }
  return res;
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

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
