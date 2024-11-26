let canvasWidth = 200;
let canvasHeight = 150;

let progressBar = document.querySelector(".progress-bar");

let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;
ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
ctx.translate(canvasWidth/2, canvasHeight/2);


for (let i=0; i<canvasHeight; i++) {
  progressBar.innerHTML = `${i/canvasHeight*100}%`;
  for (let j=0; j<canvasWidth; j++) {
    let r = i / canvasHeight * 255;
    let g = j / canvasWidth * 255;
    let b = 0;
    setPixelColor(j, i, {x: r, y: g, z: b});
  }
}
progressBar.innerHTML = "100%";

function setPixelColor(x, y, color) {
  const imgData = ctx.getImageData(x, y, x+1, y+1);
  const data = imgData.data;
  data[0] = color.x;
  data[1] = color.y;
  data[2] = color.z;
  data[3] = 255;
  ctx.putImageData(imgData, x, y);
}
