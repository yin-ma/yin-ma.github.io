let p5js;

let time = 0;
let points = [];
let path = [];
let drawing = false;
let fft_points = [];


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

    if (drawing) {
      // display the path user drew
      p.beginShape();
      p.noFill();
      p.strokeWeight(2);
      p.stroke(212, 12, 12);
      points.forEach(c => p.vertex(c.re, c.im));
      p.endShape();
    } else {
      // use fft to reconstruct path
      let v = epicycles(fft_points);
      path.unshift(v);
      p5js.beginShape();
      p5js.noFill();
      p5js.strokeWeight(2);
      p5js.stroke(212, 12, 12);
      for (let i = 0; i < path.length; i++) {
        p5js.vertex(path[i].x, path[i].y);
      }
      p5js.endShape();
  
      const dt = p5js.TWO_PI / fft_points.length;
      time += dt;
  
      if (time > p5js.TWO_PI) {
        time = 0;
        path = [];
      }
    }


  };

  p.mousePressed = () => {
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
    drawing = true;
    time = 0;
    points = [];
    fft_points = [];
    path = [];
  };

  p.mouseDragged = () => {
    if (drawing) {
      points.push(new Complex(p.mouseX - p.width/2, -p.mouseY + p.height/2));
    }
  }

  p.mouseReleased = () => {
    drawing = false;

    // pad points arr to len eq pow of 2
    let k = 0;
    while (true) {
      if (Math.pow(2, k) >= points.length) {
        break;
      } else {
        k++;
      }
    }

    let num = points.length;
    if (num === 0) return;
    for (let i=0; i<Math.pow(2, k)-num; i++) {
      points.push(points[num-1]);
    }

    // apply fft to points
    fft_points = FFT(points);
    fft_points = fft_points.map((c, freq) => {
      return {freq: freq, value: c.mult(new Complex(1/points.length, 0))};
    });
    fft_points = fft_points.sort((a, b) => b.value.length() - a.value.length());
  }

};


new p5(sketch);


function epicycles(fourier) {
  let x = 0;
  let y = 0;
  for (let i=0; i<fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].value.length();
    let phase = Math.atan2(fourier[i].value.im, fourier[i].value.re);
    x += radius * p5js.cos(freq * time + phase);
    y += radius * p5js.sin(freq * time + phase);

    p5js.stroke(0, 30);
    p5js.ellipse(prevx, prevy, radius * 2);
    p5js.stroke(0, 30);
    p5js.line(prevx, prevy, x, y);
  }
  return p5js.createVector(x, y);
}


