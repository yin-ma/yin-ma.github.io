let aspect_ratio = 4 / 3;
let canvasWidth = 200;
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
  let {progress, i, j, pixel_color, sample} = msg.data;

  setPixelColor(i, j, pixel_color, sample);
  progressBar.innerHTML = `${progress.toFixed(2)}%`;
}


function linear_to_gamma(linear_component) {
  if (linear_component > 0) {
    return Math.sqrt(linear_component);
  } else {
    return 0;
  }
}


function setPixelColor(x, y, color, sample) {
  const imgData = ctx.getImageData(x, y, x+1, y+1);
  const data = imgData.data;

  if (sample === 0) {
    data[0] = linear_to_gamma(color.x) * 255;
    data[1] = linear_to_gamma(color.y) * 255;
    data[2] = linear_to_gamma(color.z) * 255;
    data[3] = 255;
  } else {
    data[0] = linear_to_gamma((sample * Math.pow((data[0] / 255), 2) + color.x) / (sample+1)) * 255;
    data[1] = linear_to_gamma((sample * Math.pow((data[1] / 255), 2) + color.y) / (sample+1)) * 255;
    data[2] = linear_to_gamma((sample * Math.pow((data[2] / 255), 2) + color.z) / (sample+1)) * 255;
    data[3] = 255;
  }
  ctx.putImageData(imgData, x, y);
}
