import { Visualizer } from "./Visualizater.js";
import { reset, shuffle } from "./arrayUtils.js";
import { bubbleSort } from "./bubbleSort.js";
import { selectionSort } from "./selectionSort.js";
import { quickSort } from "./quickSort.js";
import { mergeSort } from "./mergeSort.js";

const canvas = document.querySelector(".canvas");
const algos = document.querySelector(".algos");
const barSlider = document.querySelector(".number-slider");
const speedSlider = document.querySelector(".speed-slider");
const shuffleBtn = document.querySelector(".shuffle-btn");
const startBtn = document.querySelector(".start-btn");

let array = reset(barSlider.value);
let visualizer = new Visualizer(canvas, algos, barSlider, speedSlider, shuffleBtn, startBtn);
visualizer.render(array);

barSlider.addEventListener("input", () => {
  array = reset(barSlider.value);
  visualizer.render(array);
})

shuffleBtn.addEventListener("click", () => {
  array = shuffle(array);
  visualizer.render(array);
})

startBtn.addEventListener("click", () => {
  switch (algos.options[algos.selectedIndex].value) {
    case "bubbleSort":
      bubbleSort(visualizer, array);
      break;
    case "selectionSort":
      selectionSort(visualizer, array);
      break;
    case "quickSort":
      quickSort(visualizer, array);
      break;
    case "mergeSort":
      mergeSort(visualizer, array);
      break;
    default:
      break;
  }
})