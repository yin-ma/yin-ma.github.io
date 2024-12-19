let elt = document.getElementById('calculator');
let calculator = Desmos.Calculator3D(elt, { expressions: true });
let drawBtn = document.querySelector(".draw-btn");
let pointInfo = document.querySelector(".points-info");

let n = GA.createNum();
let u = GA.createNum();
n.e1 = 2;
n.e2 = 4;
n.e3 = 3;
u.e1 = 2;
u.e2 = 2;
u.e3 = 6;

loadEquation();
draw();

drawBtn.addEventListener("click", () => {
  let data = new FormData(pointInfo);

  for (const [key, value] of data.entries()) {
    switch (key) {
      case "x":
        u.e1 = parseFloat(value);
        break;
      case "y":
        u.e2 = parseFloat(value);
        break;
      case "z":
        u.e3 = parseFloat(value);
        break;
      case "nx":
        n.e1 = parseFloat(value);
        break;
      case "ny":
        n.e2 = parseFloat(value);
        break;
      case "nz":
        n.e3 = parseFloat(value);
        break;
      default:
        break;
    }
  }

  draw();
})

function draw() {
  // draw normal
  calculator.setExpression({id:'graph0', latex:`\\operatorname{vector}\\left(\\left(0,0,0\\right),\\left(${n.e1},${n.e2},${n.e3}\\right)\\right)`});

  // draw interpolation
  for (let i=0; i<10; i++) {
    let res = GA.rotate(u, n, Math.PI*2*i/10);
    calculator.setExpression({id:`graph${i+1}`, latex:`(${res.e1}, ${res.e2}, ${res.e3})`});
  }
}


function loadEquation() {
  let mathEq = document.querySelector(".equation");
  let mathEq2 = document.querySelector(".equation2");
  let mathEq3 = document.querySelector(".equation3");
  mathEq.innerHTML = `$$rotation\\ formula:$$`;
  mathEq2.innerHTML = `$$u'=(wv)u(vw)=e^{-\\frac{\\theta}{2}\\hat{B}}ue^{\\frac{\\theta}{2}\\hat{B}}=e^{-\\frac{\\theta}{2}\\hat{n}I}ue^{\\frac{\\theta}{2}\\hat{n}I}$$`;
  mathEq3.innerHTML = `$$where\\ \\hat{B}\\ is\\ unit\\ bivector,\\ \\hat{n}\\ is\\ unit\\ normal,\\ I\\ is\\ pseudoscalar.$$`;
  MathJax.typesetPromise();
}


