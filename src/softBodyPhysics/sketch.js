import { Spring } from "./spring.js";
import { PointMass } from "./pointMass.js";

let points = [];
let springs = [];
let spacing = 60;
let numRow = 3;
let numCol = 5;
let threshold = 100;

const sketch = (p) => {

  p.setup = () => { 
    p.createCanvas(600, 400);
    init(p);
  };

  p.draw = () => {
    p.background(255);

    p.translate(p.width / 2, p.height);
    p.scale(1, -1);

    handleMouseClick(p);
    
    applyForce(p, points, p.createVector(0, -0.7));

    // update springs
    springs.forEach(temp => {
      temp.update();
    })

    // update points position
    points.forEach(row => {
      row.forEach(col => {
        col.update();
      })
    })

    resolveBoundary(p, points);

    render();
  };
};

new p5(sketch);


function connect(p, p1, p2) {
  springs.push(new Spring(p, p1, p2, p.dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y)));
}

function init(p) {
  for (let r=0; r<numRow; r++) {
    let tempCol = [];
    for (let c=0; c<numCol; c++) {
      tempCol.push(new PointMass(p, -100 + c*spacing, p.height-r*spacing, 20, 5, true));
    }
    points.push(tempCol);
  }

  for (let r=0; r < numRow; r++) {
    for (let c=0; c < numCol; c++) {
      if (c == 0) continue;
      connect(p, points[r][c-1], points[r][c]);
    }
  }

  for (let c=0; c < numCol; c++) {
    for (let r=0; r < numRow; r++) {
      if (r == 0) continue;
      connect(p, points[r-1][c], points[r][c]);
    }
  }

  for (let r=0; r < numRow; r++) {
    for (let c=0; c < numCol; c++) {
      if (r == 0) continue;
      if (c == 0) continue;
      connect(p, points[r][c], points[r-1][c-1]);
    }
  }

  for (let r=0; r < numRow; r++) {
    for (let c=0; c < numCol; c++) {
      if (r == 0) continue;
      if (c == numCol-1) continue;
      connect(p, points[r][c], points[r-1][c+1]);
    }
  }
}


function handleMouseClick(p) {
  if (p.mouseIsPressed) {
    let mouseX = p.mouseX - p.width/2;
    let mouseY = -1 * (p.mouseY - p.height);
    let dist = 1e6;
    let closestPoint = null;

    points.forEach(row => {
      row.forEach(col => {
        let d = p.dist(mouseX, mouseY, col.pos.x, col.pos.y);

        if ( d < threshold && d < dist) {
          dist = d;
          closestPoint = col;
        }
      })
    })

    if (closestPoint !== null) {
      let force = p.createVector(mouseX - closestPoint.pos.x, mouseY - closestPoint.pos.y);
      force.mult(10);
      closestPoint.applyForce(force);
    }
  }
}


function applyForce(p, points, force) {
  points.forEach(row => {
    row.forEach(col => {
      let tempForce = force.copy();
      col.applyForce(tempForce.mult(col.mass));
    })
  })
}


function resolveBoundary(p, points) {
  points.forEach(row => {
    row.forEach(temp => {

      if (temp.pos.y < 0) {
        if (temp.pos.y < 1e-6) {
          temp.pos.y = 0;
        } else {
          temp.pos.y *= -1;
        }
        temp.vel.y *= -1;
      }

      if (temp.pos.x < -p.width / 2) {
        temp.pos.x = -p.width / 2;
        temp.vel.x *= -1;
      }

      if (temp.pos.x > p.width / 2) {
        temp.pos.x = p.width / 2;
        temp.vel.x *= -1;
      }
    })
  })
}


function render() {
  springs.forEach(temp => {
    temp.draw();
  })

  points.forEach(row => {
    row.forEach(col => {
      col.draw();
    })
  })
}