import { Rect } from "./rect.js";

let p5js;
let squares = [];

const sketch = (p) => {

  p.setup = () => { 
    p5js = p;
    p.createCanvas(600, 400);
    p.rectMode(p.CENTER);

    squares.push(new Rect(p, 0, 0, 20, 20, p.color(0, 255, 0)));

    for (let i=0; i<10; i++) {
      let x = randomInt(-p.width/2, p.width/2);
      let y = randomInt(-p.height/2, p.height/2);
      let w = randomInt(20, 40);
      let h = randomInt(20, 40);
      let col = p.color(randomInt(0, 155), randomInt(0, 155), randomInt(0, 155));
      let rt = new Rect(p, x, y, w, h, col);
      rt.angVel = Math.random() * 0.2 - 0.1;
      squares.push(rt);
    }

    for (let i=0; i<3; i++) {
      let x = randomInt(-p.width/2, p.width/2);
      let y = randomInt(-p.height/2, p.height/2);
      let w = randomInt(60, 80);
      let h = randomInt(60, 80);
      let col = p.color(randomInt(0, 155), randomInt(0, 155), randomInt(0, 155));
      let rt = new Rect(p, x, y, w, h, col);
      rt.ang = Math.random() * 2.0 - 1.0;
      squares.push(rt);
    }
  };

  p.draw = () => {
    p.background(255);
    p.translate(p.width/2, p.height/2);
    p.scale(1, -1);

    squares.forEach(s => {
      s.update();
    })

    for (let i=0; i<squares.length-1; i++) {
      for (let j=i+1; j<squares.length; j++) {
        let isIntesect;
        isIntesect = sat(p, squares[i], squares[j]);

        if (isIntesect) {
          squares[i].activated = true;
          squares[j].activated = true;
        }
      }
    }

    squares.forEach(s => {
      s.draw();
      s.activated = false;
    })
  };

  p.keyPressed = () => {
    handleKeyPressed(p.key);
  }

  p.keyReleased = () => {
    handleKeyReleased(p.key);
  }

};

new p5(sketch);


function sat(p5, obj1, obj2) {
  let corner1 = obj1.getCornerCoor();
  let corner2 = obj2.getCornerCoor();

  for (let i=0; i<corner1.length; i++) {
    let edge1 = sub(p5, corner1[i], corner1[(i+1)%corner1.length]);
    let axis = p5.createVector(-edge1.y, edge1.x);
    axis.normalize();
    
    let [min1, max1] = project(p5, axis, corner1);
    let [min2, max2] = project(p5, axis, corner2);

    if (min1 >= max2 || min2 >= max1) return false;

  }

  for (let i=0; i<corner2.length; i++) {
    let edge2 = sub(p5, corner2[i], corner2[(i+1)%corner2.length]);
    let axis = p5.createVector(-edge2.y, edge2.x);
    axis.normalize();

    let [min1, max1] = project(p5, axis, corner1);
    let [min2, max2] = project(p5, axis, corner2);

    if (min1 >= max2 || min2 >= max1) return false;

  }

  return true;
}

function project(p5, axis, pts) {
  let min = 1e12;
  let max = -1e12;
  for (let i=0; i<pts.length; i++) {
    let res = dot(p5, axis, pts[i])
    max = Math.max(res, max);
    min = Math.min(res, min);
  }

  return [min, max];
  
}

function handleKeyPressed(key) {
  let mag = 5;
  switch (key) {
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

function handleKeyReleased(key) {
  switch (key) {
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