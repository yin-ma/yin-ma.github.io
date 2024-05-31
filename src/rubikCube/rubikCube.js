let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
ctx.translate(canvasWidth/2, canvasHeight/2);
ctx.transform(1, 0, 0, -1, 0, 0);

let canvasIsClick = false;
let mousePosition = {x: 0, y: 0};
let perspectiveMatrix = getPerspectiveMatrix(1, 1, Math.PI/2, -1, -100);
let angleMatrix = getIndentityMatrix(4);
angleMatrix = matMatMul(getTranslationMatrix(0, 0, 11), angleMatrix);
angleMatrix = matMatMul(getRotationMatrixX(Math.PI/4), angleMatrix);
angleMatrix = matMatMul(getRotationMatrixY(Math.PI/4), angleMatrix);
angleMatrix = matMatMul(getTranslationMatrix(0, 0, -11), angleMatrix);


let cubes = [];

for (let dx=-1; dx<2; dx++) {
  for (let dy=-1; dy<2; dy++) {
    for (let dz=-1; dz<2; dz++) {
      cubes.push(new Cube(dx, dy, -11+dz));
    }
  }
}

drawCubes(cubes);

canvas.addEventListener("mousedown", event => {
  canvasIsClick = true;
  mousePosition = {x: event.offsetX, y: event.offsetY};
})

canvas.addEventListener("mousemove", event => {
  if (canvasIsClick) {
    let x = mousePosition.x - event.offsetX;
    let y = mousePosition.y - event.offsetY;
    angleMatrix = matMatMul(getTranslationMatrix(0, 0, 11), angleMatrix);
    angleMatrix = matMatMul(getRotationMatrixX(y/150), angleMatrix);
    angleMatrix = matMatMul(getRotationMatrixY(x/150), angleMatrix);
    angleMatrix = matMatMul(getTranslationMatrix(0, 0, -11), angleMatrix);
    drawCubes(cubes);
    mousePosition = {x: event.offsetX, y: event.offsetY};
  }
})

canvas.addEventListener("mouseup", event => {
  canvasIsClick = false;
  mousePosition = {x: 0, y: 0};
})


document.querySelector(".l-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(1, 0, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixX(-Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(-1, 0, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.x) === -1) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".r-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(1, 0, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixX(-Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(-1, 0, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.x) === 1) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".t-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(0, 0, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixZ(Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(0, 0, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.z) === -10) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".d-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(0, 0, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixZ(Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(0, 0, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.z) === -12) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".f-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(0, 1, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixY(Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(0, -1, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.y) === -1) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".b-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(0, 1, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixY(Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(0, -1, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.y) === 1) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".il-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(1, 0, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixX(Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(-1, 0, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.x) === -1) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".ir-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(1, 0, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixX(Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(-1, 0, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.x) === 1) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".it-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(0, 0, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixZ(-Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(0, 0, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.z) === -10) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".id-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(0, 0, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixZ(-Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(0, 0, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.z) === -12) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".if-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(0, 1, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixY(-Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(0, -1, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.y) === -1) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})

document.querySelector(".ib-btn").addEventListener("click", () => {
  let tempMatrix = getIndentityMatrix(4);
  tempMatrix = matMatMul(getTranslationMatrix(0, 1, 11), tempMatrix);
  tempMatrix = matMatMul(getRotationMatrixY(-Math.PI/120), tempMatrix);
  tempMatrix = matMatMul(getTranslationMatrix(0, -1, -11), tempMatrix);

  helper(0);

  function helper(i) {
    if (i === 60) return;
    cubes.forEach(cube => {
      if (Math.round(cube.y) === 1) {
        cube.transform(tempMatrix);
      }
    });
    drawCubes(cubes);
    requestAnimationFrame(() => helper(++i));
  }
})


function drawCubes(cubes) {
  // need to draw planes one by one and sort it because no z-indexing function...
  let planes = [];
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  cubes.forEach(cube => {
    cube.planes.forEach(plane => {
      let ray = vecSubtract(matVecMul(angleMatrix, [...plane.midPoint, 1]).slice(0, 3), [0, 0, 0]);
      if (dotProduct(matVecMul(angleMatrix, [...plane.normal, 0]).slice(0, 3), ray) > 0) {
        // add plane only if the plane is seen.
        planes.push(plane);
      }
    });
  })
  planes.sort((a, b) => (matVecMul(angleMatrix, [...a.midPoint, 1])[2] - matVecMul(angleMatrix, [...b.midPoint, 1])[2]));
  planes.forEach(plane => {
    plane.draw(ctx, matMatMul(perspectiveMatrix, angleMatrix));
  })
}
