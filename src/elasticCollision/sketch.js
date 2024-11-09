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
    
    world.add(new Rect(p, 0,  p.height/2, 40, 40, 40*40, "red", true));
    //world.add(new Circle(p, 0, p.height/2, 40, 40, "red", true));
    
    world.add(new Rect(p, 100, 200, 60, 70, 1e12, "blue", false));
    //world.add(new Circle(p, 100, 200, 50, 50, "blue", false));

    for (let i=0; i<20; i++) {
      let movable = Math.random() < 0.8 ? true : false;
      let obj = world.addRandomObject(movable);
      if (movable) {
        obj.vel = p.createVector(randomInt(-2, 2), randomInt(-2, 2));
      }
    }

  };

  p.draw = () => {
    p.background(255);
    
    world.translate();
    world.update();
    world.draw();
  };

  p.keyPressed = () => {
    handleKeyPressed(p.key);
  }

  // p.keyReleased = () => {
  //   handleKeyReleased(p.key);
  // }

};

new p5(sketch);

function handleKeyPressed(key) {
  let mag = 3;
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