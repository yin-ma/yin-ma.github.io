export function drawLine(ctx, p1, p2, {color="black", lineWidth=2}) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

export function drawCircle(ctx, p, {radius=3, color="black", borderColor="white", lineWidth=1}) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export function matmul(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== rowsB) {
    throw new Error("matrix input shape not match");
  }

  const result = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return result;
}

export function transpose(M) {
  const rows = M.length;
  const cols = M[0].length;
  
  const result = Array(cols).fill(0).map(() => Array(rows).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = M[i][j];
    }
  }
  
  return result;
}

export function add(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== colsB & rowsA !== rowsB) {
    throw new Error("input shape not match");
  }

  const result = Array(rowsA).fill(0).map(() => Array(colsA).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      result[i][j] = A[i][j] + B[i][j];
    }
  }

  return result;
}

export function mul(A, v) {
  const result = Array(A.length).fill(0).map(() => Array(A[0].length).fill(0));

  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] * v;
    }
  }

  return result;
}


export function _mul(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== colsB & rowsA !== rowsB) {
    throw new Error("input shape not match");
  }

  const result = Array(rowsA).fill(0).map(() => Array(colsA).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      result[i][j] = A[i][j] * B[i][j];
    }
  }

  return result;
}


export function map(M, func) {
  const result = Array(M.length).fill(0).map(() => Array(M[0].length).fill(0));

  for (let i=0; i<M.length; i++) {
    for (let j=0; j<M[0].length; j++) {
      result[i][j] = func(M[i][j]);
    }
  }

  return result;
}


export function copy(M) {
  let res = Array(M.length).fill(0).map(() => Array(M[0].length).fill(0));

  for (let i=0; i<M.length; i++) {
    for (let j=0; j<M[0].length; j++) {
      res[i][j] = M[i][j];
    }
  }

  return res;
}
