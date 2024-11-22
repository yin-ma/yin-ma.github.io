let p5js;


const sketch = (p) => {

  p.setup = () => { 
    p5js = p;
    p.createCanvas(600, 400);
    p.rectMode(p.CENTER);
  };

  p.draw = () => {
    p.background(255);
    p.translate(p.width/2, p.height/2);
    p.scale(1, -1);

    printFPS();
  };

};

new p5(sketch);


function printFPS() {
  let fps = p5js.frameRate();
  p5js.push();
  p5js.scale(1, -1);
  p5js.fill(0);
  p5js.translate(p5js.width/2 - 50, p5js.height/2 - 10);
  p5js.text(fps.toFixed(4), 0, 0);
  p5js.pop();
}

