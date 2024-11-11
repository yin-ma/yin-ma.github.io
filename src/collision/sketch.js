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
    
    initSceneOne(p, world);
    //initSceneTwo(p, world);

  };

  p.draw = () => {
    p.background(255);
    
    world.translate();
    world.draw();
    world.update();
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

function initSceneOne(p, world) {  
  {
    world.add(new Rect(p, 0, 0, p.width - 100, 80, 80, "white", false, false));
    world.add(new Rect(p, -150, p.height/2, 20, 180, 180, "white", false, false));
    world.add(new Circle(p, 150, p.height/2, 70, 70, "white", false, false));
    world.objects[1].ang = 1.3;
    world.objects[2].ang = 0.5;
  }
  
  world.add(new Rect(p, 0,  p.height/2, 40, 40, 40*40, "green", true));

  for (let i=4; i<20; i++) {
    let obj = world.addRandomObject();
    obj.vel = p.createVector(randomInt(-2, 2), randomInt(-2, 2));
    obj.ang = Math.random() * 2.0 - 1.0;
  }
}


function handleKeyPressed(key) {
  let mag = 8;
  switch (key) {
    case "a":
      world.objects[3].vel.x -= mag;
      break;
    case "d":
      world.objects[3].vel.x += mag;
      break;
    case "w":
      world.objects[3].vel.y += mag;
      break;
    case "s":
      world.objects[3].vel.y -= mag;
      break;
    default:
      break;
  }
}

function handleKeyReleased(key) {
  switch (key) {
    case "a":
      world.objects[3].vel.x = 0;
      break;
    case "d":
      world.objects[3].vel.x = 0;
      break;
    case "w":
      world.objects[3].vel.y = 0;
      break;
    case "s":
      world.objects[3].vel.y = 0;
      break;
    default:
      break;
  }
}