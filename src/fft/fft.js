let canvas = document.querySelector(".canvas-wave");
let canvasFre = document.querySelector(".canvas-fre");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let ctxFre = canvasFre.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
ctx.setTransform(1,0,0,-1,0,canvas.height);
ctx.translate(canvasWidth/2, canvasHeight/2);
ctxFre.setTransform(1,0,0,-1,0,canvas.height);

drawAxis();
drawWave([1, 2, 3, 4, 3, 2, 1, 0]);

let points = [];

function drawWave(p) {
  let maxAmp = Math.max(Math.abs(Math.max(...p)), Math.abs(Math.min(...p)));
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i=0; i<p.length-1; i++) {
    ctx.moveTo(-canvasWidth/2 + canvasWidth / (p.length-1) *i, p[i]/maxAmp*(canvasHeight/2));
    ctx.lineTo(-canvasWidth/2 + canvasWidth / (p.length-1) *(i+1), p[i+1] / maxAmp*(canvasHeight/2));
  }
  ctx.stroke();
}

// ctx.beginPath();
// for (let i=0; i<parseInt(canvasWidth); i++) {
//   ctx.moveTo(-canvasWidth/2 + i, canvasHeight/2*Math.sin(Math.PI*2/canvasWidth*i));
//   ctx.lineTo(-canvasWidth/2 + i+1, canvasHeight/2*Math.sin(Math.PI*2/canvasWidth*(i+1)));
//   ctx.stroke();
//   points.push([-canvasWidth/2 + i, canvasHeight/2*Math.sin(Math.PI*2/canvasWidth*i)]);
// }

function drawAxis() {
  ctx.beginPath();
  ctx.strokeStyle ="rgba(0, 0, 0, 0.6)";
  ctx.setLineDash([5, 4]);
  ctx.moveTo(-canvasWidth/2, 0);
  ctx.lineTo(canvasWidth/2, 0);
  ctx.stroke();
  ctx.setLineDash([]);
}



// FFT([new Complex(3, 0), new Complex(7, 0), new Complex(21, 0), new Complex(5, 0)]);
