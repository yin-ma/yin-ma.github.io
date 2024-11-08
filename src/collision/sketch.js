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

    // world.add(new Circle(p, -200, 100, 50, 20, "white", true));
    // world.add(new Rect(p, 100, 100, 200, 100, 20, "white", true));

    // world.add(new Circle(p, -300, 100, 50, 50, "white", true));
    // world.add(new Circle(p, 0, 100, 30, 30, "red", true));

    // world.objects[0].vel.x = 10.0;

    // world.add(new Rect(p, -100, 200, 200, 10, 20, "white", true));
    // world.objects[0].ang = 0.5;

    // world.add(new Rect(p, -100, 200, 10, 100, 20, "white", true));
    // world.objects[1].ang = 0.5;

    world.add(new Rect(p, 90, 100, 200, 100, 20, "white", true));
    world.objects[0].ang = 0.4;
    
    world.add(new Rect(p, -90, 100, 200, 100, 20, "white", true));
    world.objects[1].ang = -0.6;

  };

  p.draw = () => {
    p.background(255);
    
    world.translate();
    world.handleClick();
    world.draw();
    world.update();
  };

  p.mousePressed = () => {
  }

};

new p5(sketch);

