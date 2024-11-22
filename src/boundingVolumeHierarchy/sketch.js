import { AABB } from "./aabb.js";
import { BVH } from "./bvh.js";
import { Rect } from "./rect.js";

let p5js;

let numRect = 8;
let rects = [];
let bvh;

let region = new AABB(-100, 100, -100, 100);

const sketch = (p) => {

  p.setup = () => { 
    p5js = p;
    p.createCanvas(600, 400);
    p.rectMode(p.CENTER);

    init();
  };

  p.draw = () => {
    p.background(255);
    p.translate(p.width/2, p.height/2);
    p.scale(1, -1);

    rects.forEach(r => r.update());
    boundingCheck();

    bvh = new BVH(rects);

    let tempColor = [];
    let res = [];
    rects.forEach(r => {
      tempColor.push(r.color);
    })
    bvh.query(bvh.root, region, res);

    res.forEach(r => {
      r.color = p.color(255, 0, 0);
    })
    dfs(bvh.root);

    region.draw2(p);

    rects.forEach((r, idx) => {
      r.color = tempColor[idx];
    })


    printFPS();
  };

};


new p5(sketch);


function dfs(node) {
  if (Rect.prototype.isPrototypeOf(node)) {
    node.draw(p5js);
    return;
  } else {
    node.aabb.draw(p5js);
    if (node.left !== null) dfs(node.left);
    if (node.right !== null) dfs(node.right);
    return;
  }
}


function boundingCheck() {
  rects.forEach(r => {
    if (r.x - r.w/2 < -p5js.width/2) {
      r.x = -p5js.width/2 + r.w/2;
      r.velx *= -1;
    }
    if (r.x + r.w/2 > p5js.width/2) {
      r.x = p5js.width/2 - r.w/2;
      r.velx *= -1;
    }
    if (r.y - r.h/2 < -p5js.height/2) {
      r.y = -p5js.height/2 + r.h/2;
      r.vely *= -1;
    }
    if (r.y + r.h/2 > p5js.height/2) {
      r.y = p5js.height/2 - r.h/2;
      r.vely *= -1;
    }
  })
}


function init() {
  for(let i=0; i<numRect; i++) {
    rects.push(randomRect());
  }
}

function randomRect() {
  let minW = 20;
  let maxW = 80;
  let minH = 20;
  let maxH = 80;
  let temp = new Rect(randomInt(-p5js.width/2+maxW/2, p5js.width/2-maxW/2), randomInt(-p5js.height/2+maxH/2, p5js.height/2-maxH/2), randomInt(minW, maxW), randomInt(minH, maxH), randomColor(p5js));
  temp.velx = randomBetween(-2, 2);
  temp.vely = randomBetween(-2, 2);
  return temp;
}


function printFPS() {
  let fps = p5js.frameRate();
  p5js.push();
  p5js.scale(1, -1);
  p5js.fill(0);
  p5js.translate(p5js.width/2 - 50, p5js.height/2 - 10);
  p5js.text(fps.toFixed(4), 0, 0);
  p5js.pop();
}

