const sketch = (p) => {

  p.setup = () => { 
    p.createCanvas(600, 400);
  };

  p.draw = () => {
    p.background(255);
    p.translate(p.width / 2, p.height);
    p.scale(1, -1);

    p.fill("red");
    p.circle(0, 0, 200);
  };
};

new p5(sketch);

