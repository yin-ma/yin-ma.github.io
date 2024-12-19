let pointX = document.querySelector(".point-x");
let pointY = document.querySelector(".point-y");
let pointZ = document.querySelector(".point-z");

let lineX = document.querySelector(".line-x");
let lineY = document.querySelector(".line-y");
let lineZ = document.querySelector(".line-z");

let angleInput = document.querySelector(".angle");

let drawBtn = document.querySelector(".draw");

let point = {x:1, y:2, z:3};
let line = {x:4, y:5, z:6};
let angle = 6.28;
let rotatedPoint = rotation(point, line, angle);

// original point
let trace1 = {
  x:[point.x], y:[point.y], z:[point.z],
  mode: 'markers',
  marker: {
    size: 5,
    line: {
    color: 'rgba(217, 17, 17, 0.8)',
    width: 0.5},
    opacity: 0.8},
  type: 'scatter3d'
};

// rotated point
let trace2 = {
  x:[rotatedPoint.x], y:[rotatedPoint.y], z:[rotatedPoint.z],
  mode: 'markers',
  marker: {
    size: 5,
    line: {
    color: 'rgba(17, 217, 17, 0.8)',
    width: 0.5},
    opacity: 0.8},
  type: 'scatter3d'
};

// rotation axis
let trace3 = {
  type: 'scatter3d',
  mode: 'lines',
  x: [0, line.x],
  y: [0, line.y],
  z: [0, line.z],
  opacity: 1,
  line: {
    width: 6,
    color: 'rgba(217, 17, 17, 0.8)',
    reversescale: false
  }
}

window.onload = function() {
  let mathFormula = document.querySelector(".math-formula");
  mathFormula.style.display = "flex";
};

draw();

function rotation(point, line, angle) {
  let p = new Quaternion(0, point.x, point.y, point.z);
  let lineLength = Math.sqrt(Math.pow(line.x, 2) + Math.pow(line.y, 2) + Math.pow(line.z, 2));
  let tempLine = {x: line.x / lineLength, y: line.y / lineLength, z: line.z / lineLength};
  let q = new Quaternion(Math.cos(angle/2), tempLine.x * Math.sin(angle/2), tempLine.y * Math.sin(angle/2), tempLine.z * Math.sin(angle/2));

  let res = multiply(q, multiply(p, conjugate(q)));
  return {x: res.x, y:res.y, z:res.z};
}

function draw() {  
  let tx = [];
  let ty = [];
  let tz = [];
  for (let t=1; t<10; t++) {
    let temp = rotation(point, line, t/10*angle);
    tx.push(temp.x);
    ty.push(temp.y);
    tz.push(temp.z);
  }
  trace2.x = tx;
  trace2.y = ty;
  trace2.z = tz;
  let data = [trace3, trace1, trace2];
  let layout = {margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
      width: 600,
      height: 400
  };
  
  Plotly.newPlot('myDiv', data, layout);
}

drawBtn.addEventListener("click", event => {
  draw();
})

lineX.addEventListener("input", event => {
  trace3.x = [0, parseFloat(event.target.value)];
  line.x = parseFloat(event.target.value);
})

lineY.addEventListener("input", event => {
  trace3.y = [0, parseFloat(event.target.value)];
  line.y = parseFloat(event.target.value);
})

lineZ.addEventListener("input", event => {
  trace3.z = [0, parseFloat(event.target.value)];
  line.z = parseFloat(event.target.value);
})

pointX.addEventListener("input", event => {
  trace1.x = [parseFloat(event.target.value)];
  point.x = parseFloat(event.target.value);
})

pointY.addEventListener("input", event => {
  trace1.y = [parseFloat(event.target.value)];
  point.y = parseFloat(event.target.value);
})

pointZ.addEventListener("input", event => {
  trace1.z = [parseFloat(event.target.value)];
  point.z = parseFloat(event.target.value);
})

angleInput.addEventListener("input", event => {
  angle = parseFloat(event.target.value);
})

initEquation()

function initEquation() {
  let eq1 = document.querySelector(".equation1");
  let eq2 = document.querySelector(".equation2");
  let eq3 = document.querySelector(".equation3");
  let eq4 = document.querySelector(".equation4");
  let eq5 = document.querySelector(".equation5");

  eq1.innerHTML = `rotation formula`;
  eq2.innerHTML = `$$v'=qvq*=qvq^{-1}$$`;
  eq3.innerHTML = `$$where\\;v=[0,\\; x\\overrightarrow{i},\\; y\\overrightarrow{j},\\;z\\overrightarrow{k}]$$`;
  eq4.innerHTML = `$$q = [\\cos(\\frac{\\theta}{2}), \\sin(\\frac{\\theta}{2})\\overrightarrow{u}]$$`;
  eq5.innerHTML = `$$\\overrightarrow{u}\\;is\\;normalized\\;quaternion\\;of\\;axis$$`

  MathJax.typesetPromise();
}