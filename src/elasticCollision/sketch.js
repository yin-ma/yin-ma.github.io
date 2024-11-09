import { Circle } from "./circle.js";
import { Rect } from "./rect.js";
import { World } from "./world.js";

let p5js;
let world;

const sketch = (p) => {

  p.setup = () => { 
    p5js = p;
    p.createCanvas(600, 400);
    p.rectMode(p.CENTER);

    world = new World(p);
    
    world.add(new Rect(p, 0,  p.height/2, 40, 40, 20, "green", true));

    for (let i=0; i<20; i++) {
      let obj = world.addRandomObject();
      obj.vel = p.createVector(randomInt(-3, 3), randomInt(-3, 3));
    }

  };

  p.draw = () => {
    p.background(255);
    
    world.translate();
    world.update();
    world.draw();
  };
  
  p.mousePressed = () => {
    world.handleClick();
  }

  p.keyPressed = () => {
    handleKeyPressed(p.key);
  }

  p.keyReleased = () => {
    handleKeyReleased(p.key);
  }

};

new p5(sketch);


function handleKeyPressed(key) {
  let mag = 5;
  switch (key) {
    case "a":
      world.objects[0].vel.x -= mag;
      break;
    case "d":
      world.objects[0].vel.x += mag;
      break;
    case "w":
      world.objects[0].vel.y += mag;
      break;
    case "s":
      world.objects[0].vel.y -= mag;
      break;
    default:
      break;
  }
}

function handleKeyReleased(key) {
  switch (key) {
    case "a":
      world.objects[0].vel.x = 0;
      break;
    case "d":
      world.objects[0].vel.x = 0;
      break;
    case "w":
      world.objects[0].vel.y = 0;
      break;
    case "s":
      world.objects[0].vel.y = 0;
      break;
    default:
      break;
  }
}