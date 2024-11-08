import { Rect } from "./rect.js";

let p5js;
let squares = [];

const sketch = (p) => {

  p.setup = () => { 
    p5js = p;
    p.createCanvas(600, 400);
    p.rectMode(p.CENTER);

    squares.push(new Rect(p, 0, 0, 20, 20, p.color(255, 0, 0)));

    for (let i=0; i<10; i++) {
      let x = randomInt(-p.width/2, p.width/2);
      let y = randomInt(-p.height/2, p.height/2);
      let w = randomInt(20, 40);
      let h = randomInt(20, 40);
      let col = p.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
      squares.push(new Rect(p, x, y, w, h, col));
    }
  };

  p.draw = () => {
    p.background(255);
    p.translate(p.width/2, p.height/2);
    p.scale(1, -1);

    squares.forEach(s => {
      s.update();
    })

    squares.forEach(s => {
      s.draw();
    })
  };

  p.keyPressed = () => {
    let mag = 10;
    switch (p.key) {
      case "a":
        squares[0].vel.x -= mag;
        break;
      case "d":
        squares[0].vel.x += mag;
        break;
      case "w":
        squares[0].vel.y += mag;
        break;
        case "s":
          squares[0].vel.y -= mag;
          break;
      default:
        break;
    }
  }

  p.keyReleased = () => {
    switch (p.key) {
      case "a":
        squares[0].vel.x = 0;
        break;
      case "d":
        squares[0].vel.x = 0;
        break;
      case "w":
        squares[0].vel.y = 0;
        break;
        case "s":
          squares[0].vel.y = 0;
          break;
      default:
        break;
    }
  }


};

new p5(sketch);

