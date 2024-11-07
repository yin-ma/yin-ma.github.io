import { Circle } from "./circle.js";
import { Rect } from "./rect.js";
import { World } from "./world.js";

let world;

const sketch = (p) => {

  p.setup = () => { 
    p.createCanvas(600, 400);
    p.rectMode(p.CENTER);

    world = new World(p);

    // world.add(new Circle(p, -200, 100, 50, 20, "white", false));
    // world.add(new Rect(p, 100, 100, 200, 100, 20, "white", false));

    world.add(new Circle(p, -300, 100, 50, 50, "white", true));
    world.add(new Circle(p, 0, 100, 30, 30, "red", true));

    world.objects[0].vel.x = 5;

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

};

new p5(sketch);

