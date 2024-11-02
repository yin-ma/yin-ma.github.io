import { AtwoodMachine } from "./atwoodMachine.js";
import { FreeFall } from "./freefall.js";
import { SHM } from "./shm.js";
import { SimplePendulum } from "./simplePendulum.js";

let frame;
let p5Ref;
let currentScene = 1;
let totalScene = 4;
let sceneBtn = document.querySelector(".scene");
let preBtn = document.querySelector(".prev");
let aftBtn = document.querySelector(".aft");

preBtn.addEventListener("click", () => {
  currentScene -= 1;

  if (currentScene == 0) {
    currentScene = totalScene;
  }

  sceneBtn.innerHTML = currentScene;
  switchScene();
})

aftBtn.addEventListener("click", () => {
  currentScene += 1;

  if (currentScene == totalScene + 1) {
    currentScene = 1;
  }

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
    case 3:
      frame = new SimplePendulum(p5Ref);
      break;
    case 4:
      frame = new AtwoodMachine(p5Ref);
      break;
    default:
      frame = new FreeFall(p5Ref);
      break;
  }
}