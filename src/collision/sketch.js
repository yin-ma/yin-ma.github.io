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
    
    world.add(new Rect(p, 0,  p.height/2, 40, 40, 40*40, "green", true));

    {
      world.add(new Rect(p, 0, 0, p.width - 100, 80, 1e12, "white", false, false));
      world.add(new Rect(p, -150, p.height/2, 20, 180, 1e12, "white", false, false));
      world.add(new Circle(p, 150, p.height/2, 70, 1e12, "white", false, false));
      world.objects[2].ang = 1.3;
      world.objects[3].ang = 0.5;
      world.objects[1].inertia = 1e12;
      world.objects[2].inertia = 1e12;
      world.objects[3].inertia = 1e12;
    }

    for (let i=0; i<20; i++) {
      let obj = world.addRandomObject();
      obj.vel = p.createVector(randomInt(-2, 2), randomInt(-2, 2));
      obj.ang = Math.random() * 2.0 - 1.0;
    }

  };

  p.draw = () => {
    p.background(255);
    
    world.translate();
    world.update();
    world.draw();

    console.log(world.objects[0].vel.x, world.objects[0].vel.y);
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
  let mag = 4;
  switch (key) {
    case "a":
      world.objects[0].acc.x -= mag;
      break;
    case "d":
      world.objects[0].acc.x += mag;
      break;
    case "w":
      world.objects[0].acc.y += mag + 10;
      break;
    case "s":
      world.objects[0].acc.y -= mag + 10;
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