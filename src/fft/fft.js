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

let icanvas = document.querySelector(".icanvas-fre");
let icanvasWave = document.querySelector(".icanvas-wave");
let ictx = icanvas.getContext("2d");
let ictxWave = icanvasWave.getContext("2d");
ictx.setTransform(1,0,0,-1,0,canvas.height);
ictxWave.setTransform(1,0,0,-1,0,canvas.height);
ictxWave.translate(canvasWidth/2, canvasHeight/2);

let arr = new Array(512).fill(0);
let iarr = new Array(512).fill(0);
let isDrawing = false;

init();

canvas.addEventListener("mousedown", event => {
  isDrawing = true;
})

canvas.addEventListener("mousemove", event => {
  if (isDrawing) {
    arr[Math.min(Math.max(0, parseInt(event.offsetX)), arr.length-1)] =  new Complex((-parseInt(Math.min(event.offsetY, canvasHeight)) + canvasHeight/2) / canvasHeight * 2, 0);
    render(arr);
  }
})

document.addEventListener("mouseup", event => {
  isDrawing = false;
})

icanvas.addEventListener("mousedown", () => {
  isDrawing = true;
})

icanvas.addEventListener("mousemove", event => {
  if (isDrawing) {
    iarr[parseInt(event.offsetX/2)%iarr.length] = (-parseInt(event.offsetY) + canvasHeight) / canvasHeight;
    irender(iarr);
  }
})

icanvas.addEventListener("mouseup", () => {
  isDrawing = false;
})

function irender(p) {
  ictx.clearRect(0, 0, canvasWidth, canvasHeight);
  ictxWave.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  drawiFrequency(p);
  drawIwave(iFFT(p.map(v => new Complex(v, 0))));
}

function render(p) {
  ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
  ctxFre.clearRect(0, 0, canvasWidth, canvasHeight);
  drawAxis();
  drawWave(p);
  drawFrequency(FFT(p));
}

function init() {
  drawAxis();
  for (let i=0; i < arr.length; i++) {
    let thetha = Math.PI*2/arr.length*i;
    arr[i] = Math.cos(thetha) + Math.cos(3*thetha) + 4*Math.cos(4*thetha) + Math.cos(5*thetha);
  }
  let maxAmp = Math.max(...arr);
  arr = arr.map(v => new Complex(v / maxAmp, 0));
  let fftArr = FFT(arr);
  drawWave(arr);
  drawFrequency(fftArr);

  iarr[1] = 0.25;
  iarr[3] = 0.25;
  iarr[4] = 1;
  iarr[5] = 0.25;
  drawiFrequency(iarr);
  let ifftIarr = iFFT(iarr.map(v => new Complex(v*canvasHeight, 0)));
  drawIwave(ifftIarr);
}

function drawIwave(p) {
  let realArray = p.map(v => v.real);
  let absArray = p.map(v => Math.abs(v.real));
  let maxAmp = Math.max(...absArray);
  ictxWave.lineWidth = 1;
  ictxWave.strokeStyle = "orange";
  ictxWave.beginPath();
  for (let i=0; i<p.length-1; i++) {
    ictxWave.moveTo(-canvasWidth/2 + canvasWidth / (realArray.length-1) *i, realArray[i]*(canvasHeight/2)/ maxAmp);
    ictxWave.lineTo(-canvasWidth/2 + canvasWidth / (realArray.length-1) *(i+1), realArray[i+1] *(canvasHeight/2)/ maxAmp);
  }
  ictxWave.stroke();
}

function drawiFrequency(p) {
  ictx.lineWidth = 2;
  for (let i=0; i<p.length/2; i++) {
    ictx.strokeStyle = `hsl(${i / canvasWidth *360}, 76%, 50%)`;
    ictx.beginPath();
    ictx.moveTo(i*2, 0);
    ictx.lineTo(i*2, p[i]*canvasHeight);
    ictx.stroke();
  }
}


function drawFrequency(p) {
  let absArray = p.map(v => abs(v))
  let maxAmp = Math.max(...absArray);
  ctxFre.lineWidth = 2;
  for (let i=0; i<absArray.length/2; i++) {
    ctxFre.strokeStyle = `hsl(${i / canvasWidth *360}, 76%, 50%)`;
    ctxFre.beginPath();
    ctxFre.moveTo(canvasWidth / absArray.length * i * 2, 0);
    ctxFre.lineTo(canvasWidth / absArray.length * i * 2, absArray[i] / maxAmp * canvasHeight)
    ctxFre.stroke();
  }
}

function drawWave(p) {
  let realArray = p.map(v => v.real);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "orange";
  ctx.beginPath();
  for (let i=0; i<p.length-1; i++) {
    ctx.moveTo(-canvasWidth/2 + canvasWidth / (realArray.length-1) *i, realArray[i]*(canvasHeight/2));
    ctx.lineTo(-canvasWidth/2 + canvasWidth / (realArray.length-1) *(i+1), realArray[i+1] *(canvasHeight/2));
  }
  ctx.stroke();
}

function drawAxis() {
  ctx.beginPath();
  ctx.strokeStyle ="rgba(0, 0, 0, 0.6)";
  ctx.setLineDash([5, 4]);
  ctx.moveTo(-canvasWidth/2, 0);
  ctx.lineTo(canvasWidth/2, 0);
  ctx.stroke();
  ctx.setLineDash([]);
}