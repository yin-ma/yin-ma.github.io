import { FreeFall } from "./freefall.js";
import { SHM } from "./shm.js";

let frame;
let p5Ref;
let currentScene = 1;
let sceneBtn = document.querySelector(".scene");
let preBtn = document.querySelector(".prev");
let aftBtn = document.querySelector(".aft");

preBtn.addEventListener("click", () => {
  currentScene -= 1;
  sceneBtn.innerHTML = currentScene;
  switchScene();
})

aftBtn.addEventListener("click", () => {
  currentScene += 1;
  sceneBtn.innerHTML = currentScene;
  switchScene();
})

const sketch = (p) => {
  p5Ref = p;

  p.setup = () => { 
    p.createCanvas(600, 400);
    frame = new FreeFall(p);
  };

  p.draw = () => {
    p.background(255);
    p.translate(p.width / 2, p.height / 2);
    p.scale(1, -1);
    frame.update();
    frame.show();
  };
};

new p5(sketch);

function switchScene() {
  switch (currentScene) {
    case 1:
      frame = new FreeFall(p5Ref);
      break;
    case 2:
      frame = new SHM(p5Ref);
      break;
    default:
      frame = new FreeFall(p5Ref);
      break;
  }
}