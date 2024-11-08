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

    world.add(new Rect(p, 0, 0, 50, 50, 20, "green", true));

    // world.add(new Circle(p, -200, 100, 50, 20, "white", true));
    // world.add(new Rect(p, 100, 100, 200, 100, 20, "white", true));

    // world.add(new Circle(p, -300, 100, 50, 50, "white", true));
    // world.add(new Circle(p, 0, 100, 30, 30, "red", true));

    // world.objects[0].vel.x = 10.0;

    // world.add(new Rect(p, -100, 200, 200, 10, 20, "white", true));
    // world.objects[0].ang = 0.5;

    // world.add(new Rect(p, -100, 200, 10, 100, 20, "white", true));
    // world.objects[1].ang = 0.5;

    world.add(new Rect(p, -100, p.height/2, 50, 100, 20, "white", true));
    world.objects[0].ang = 0.4;
    
    world.add(new Rect(p, 150, p.height/2, 70, 100, 20, "white", true));
    world.objects[1].ang = -0.6;

  };

  p.draw = () => {
    p.background(255);
    
    world.translate();
    world.handleClick();
    world.update();
    world.draw();
  };

  p.mousePressed = () => {
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