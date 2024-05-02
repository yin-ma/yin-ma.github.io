const hueRange = 50;

export class Visualizer {
  constructor(canvas, algos, barSlider, speedSlider, shuffleBtn, startBtn) {
    this.canvas = canvas;
    this.algos = algos;
    this.barSlider = barSlider;
    this.speedSlider = speedSlider;
    this.shuffleBtn = shuffleBtn;
    this.startBtn = startBtn;
  }

  running() {
    this.algos.disabled = true;
    this.barSlider.disabled = true;
    this.speedSlider.disabled = true;
    this.shuffleBtn.disabled = true;
    this.startBtn.disabled = true;
  }

  finished() {
    this.algos.disabled = false;
    this.barSlider.disabled = false;
    this.speedSlider.disabled = false;
    this.shuffleBtn.disabled = false;
    this.startBtn.disabled = false;
  }

  getSpeed() {
    return parseInt(this.speedSlider.getAttribute("max")) - this.speedSlider.value;
  }

  render(array) {
    // could modify the existing element instead
    // but I choose to clear everything and add new bars
    this.canvas.innerHTML = "";
    let hueStep = hueRange/array.length;
    let heightStep = 100/array.length;
    let width = 100/array.length;

    for (let i=0; i<array.length; i++) {
      let div = document.createElement("div");
      div.style.width = `${width}%`;
      div.style.height = `${array[i]*heightStep}%`;
      div.style.backgroundColor = `hsl(${array[i]*hueStep}, 80%, 50%)`;
      this.canvas.appendChild(div);
    }
  }
}