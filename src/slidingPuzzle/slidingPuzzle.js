let canvas = document.querySelector(".canvas");
let numRow = 4;
let numCol = 4;
let slider = new Slider(canvas, numRow, numCol);
let gridElement = [];
let grid = [];
let shuffleBtn = document.querySelector(".shuffle-btn");
let solveBtn = document.querySelector(".solve-btn");
let numberSlider = document.querySelector(".number-slider");
let myFile = document.querySelector(".myFile");
let fileReader = new FileReader();

document.documentElement.style.setProperty('--bgSize', `${numCol*100}%`);
document.documentElement.style.setProperty('--bgImg', `url("/assets/sliderImg.png")`);

numberSlider.addEventListener("input", () => {
  slider.numRow = parseInt(numberSlider.value);
  slider.numCol = parseInt(numberSlider.value);
  document.documentElement.style.setProperty('--bgSize', `${slider.numCol*100}%`);
  slider.init();
})

myFile.addEventListener("change", event => {
  fileReader.readAsDataURL(event.target.files[0]);

})

fileReader.addEventListener("load", () => {
  document.documentElement.style.setProperty('--bgImg', `url("${fileReader.result}")`);
})

shuffleBtn.addEventListener("click", async() => {
  numberSlider.disabled = true;
  solveBtn.disabled = true;
  shuffleBtn.disabled= true;
  await slider.shuffle();
  numberSlider.disabled = false;
  solveBtn.disabled = false;
  shuffleBtn.disabled= false;
})

solveBtn.addEventListener("click", async() => {
  numberSlider.disabled = true;
  solveBtn.disabled = true;
  shuffleBtn.disabled= true;
  await slider.solve();
  numberSlider.disabled = false;
  solveBtn.disabled = false;
  shuffleBtn.disabled= false;
})

document.addEventListener("keydown", async event => {
  switch (event.key) {
    case "w":
      await slider.move("D");
      break;
    case "a":
      await slider.move("R");
      break;
    case "s":
      await slider.move("U");
      break;
    case "d":
      await slider.move("L");
      break;
    default:
      break;
  }
  slider.draw();
})