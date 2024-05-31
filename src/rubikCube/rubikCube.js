let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
ctx.translate(canvasWidth/2, canvasHeight/2);
ctx.transform(1, 0, 0, -1, 0, 0);

let perspectiveMatrix = getPerspectiveMatrix(1, 1, Math.PI/2, -1, -100);
let r1 = getIndentityMatrix(4);
let r2 = getIndentityMatrix(4);
r1 = matMatMul(getTranslationMatrix(0, 0, 11), r1);
r1 = matMatMul(getRotationMatrixX(-Math.PI/4), r1);
r1 = matMatMul(getRotationMatrixY(Math.PI/4), r1);
r1 = matMatMul(getTranslationMatrix(0, 0, -11), r1);

let cubes = [];

for (let dx=-1; dx<2; dx++) {
  for (let dy=-1; dy<2; dy++) {
    for (let dz=-1; dz<2; dz++) {
      cubes.push(new Cube(dx, dy, -11+dz));
    }
  }
}

cubes.forEach(cube => {
  cube.transform(r1);
})

drawCubes(cubes);

// L
let lRotataion = getIndentityMatrix(4);
lRotataion = matMatMul(getTranslationMatrix(1, 0, 11), lRotataion);
lRotataion = matMatMul(getRotationMatrixX(Math.PI/120), lRotataion);
lRotataion = matMatMul(getTranslationMatrix(-1, 0, -11), lRotataion);

// R
let rRotataion = getIndentityMatrix(4);
rRotataion = matMatMul(getTranslationMatrix(-1, 0, 11), rRotataion);
rRotataion = matMatMul(getRotationMatrixX(-Math.PI/120), rRotataion);
rRotataion = matMatMul(getTranslationMatrix(1, 0, -11), rRotataion);

// T
let tRotataion = getIndentityMatrix(4);
tRotataion = matMatMul(getTranslationMatrix(0, -1, 11), tRotataion);
tRotataion = matMatMul(getRotationMatrixY(Math.PI/120), tRotataion);
tRotataion = matMatMul(getTranslationMatrix(0, 1, -11), tRotataion);

// D
let dRotataion = getIndentityMatrix(4);
dRotataion = matMatMul(getTranslationMatrix(0, -1, 11), dRotataion);
dRotataion = matMatMul(getRotationMatrixY(-Math.PI/120), dRotataion);
dRotataion = matMatMul(getTranslationMatrix(0, 1, -11), dRotataion);

// F
let fRotataion = getIndentityMatrix(4);
fRotataion = matMatMul(getTranslationMatrix(0, 0, -12), fRotataion);
fRotataion = matMatMul(getRotationMatrixZ(-Math.PI/120), fRotataion);
fRotataion = matMatMul(getTranslationMatrix(0, 0, 12), fRotataion);

// B
let bRotataion = getIndentityMatrix(4);
bRotataion = matMatMul(getTranslationMatrix(0, 0, -13), bRotataion);
bRotataion = matMatMul(getRotationMatrixZ(Math.PI/120), bRotataion);
bRotataion = matMatMul(getTranslationMatrix(0, 0, 13), bRotataion);


document.addEventListener("keypress", event => {
  switch (event.key) {
    case "a":
      animateMove(lRotataion, 0);
      break;
    case "q":
      animateMove(fRotataion, 0);
      break;
    case "e":
      animateMove(bRotataion, 0);
      break;
    case "d":
      animateMove(rRotataion, 0);
      break;
    case "w":
      animateMove(tRotataion, 0);
      break;
    case "x":
      animateMove(dRotataion, 0);
      break;
    default:
      break;
  }
})

function animateMove(matrix, i) {
  if (i === 60) return;
  cubes.forEach(cube => {
    cube.transform(matrix);
  });
  drawCubes(cubes);
  requestAnimationFrame(() => animateMove(matrix, ++i));
}

function drawCubes(cubes) {
  // need to draw planes one by one and sort it because no z-indexing function...
  let planes = [];
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  cubes.forEach(cube => {
    cube.planes.forEach(plane => {
      let ray = vecSubtract(plane.midPoint, [0, 0, 0]);
      if (dotProduct(plane.normal, ray) > 0) {
        // add plane only if the plane is seen.
        planes.push(plane);
      }
    });
  })
  
  planes.sort((a, b) => (a.midPoint[2] - b.midPoint[2]));
  planes.forEach(plane => {
    plane.draw(ctx, perspectiveMatrix);
  })
}

function render() {
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  cubes.forEach(cube => {
    cube.transform(r1);
  });
  drawCubes(cubes);

  requestAnimationFrame(() => render());
}