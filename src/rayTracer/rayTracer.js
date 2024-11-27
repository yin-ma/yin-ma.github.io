let aspect_ratio = 4 / 3;
let canvasWidth = 100;
let canvasHeight = Math.floor(canvasWidth / aspect_ratio);

let progressBar = document.querySelector(".progress-bar");
let renderBtn = document.querySelector(".render");

let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = canvasWidth;
canvas.height = canvasHeight;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasWidth, canvasHeight);
//ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
//ctx.translate(canvasWidth/2, canvasHeight/2);


let worker = new Worker("script.js");

renderBtn.addEventListener("click", event => {
  worker.postMessage({canvasWidth, canvasHeight});
})

worker.onmessage = (msg) => {
  let {progress, i, j, color} = msg.data;

  setPixelColor(i, j, color);
  progressBar.innerHTML = `${progress.toFixed(2)}%`;
}


function setPixelColor(x, y, color) {
  const imgData = ctx.getImageData(x, y, x+1, y+1);
  const data = imgData.data;
  data[0] = color.x * 255;
  data[1] = color.y * 255;
  data[2] = color.z * 255;
  data[3] = 255;
  ctx.putImageData(imgData, x, y);
}
