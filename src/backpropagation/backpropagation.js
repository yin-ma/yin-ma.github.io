import { NeuralNetwork } from "./neuralnetwork.js"
import * as utils from "./utils.js"

let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 450;


let sizes = [1, 16, 16, 1];
let model = new NeuralNetwork(sizes);

model.train();
for (let epoch = 0; epoch < 5000; epoch++) {
  model.zero_grad();
  
  let loss = 0;

  for (let b=0; b<32; b++) {
    let x = [[Math.random()*10]];
    let y = model.forward(x);
    let target = (x[0][0]) ** 3 / 1000;
    loss += (y[0][0] - target) ** 2;
    model.backward([[target]]);
  }

  model.step()
  console.log(`Epoch ${epoch}, Loss: ${loss/8}`);
}

model.eval();
for (let i= 0; i< 10; i++) {
  let x = [[i]]; 
  let y_test = model.forward(x);
  console.log(`real output: ${(x[0][0]**3).toFixed(2)}, Test output: ${(y_test[0][0]*1000).toFixed(2)}`);
}


for (let l=0; l<sizes.length-1; l++) {
  let diameter = 10;
  for (let i=0; i<sizes[l]; i++) {
    let n_i = sizes[l];
    let i_vSpace = canvas.height / (n_i+1);
    let i_hSpace = canvas.width / (sizes.length+1);
    let x1 = i_hSpace*(l+1) - diameter/2;
    let y1 = i_vSpace*(i+1) - diameter/2;
    for (let j=0; j<sizes[l+1]; j++) {
      let n_j = sizes[l+1];
      let j_vSpace = canvas.height / (n_j+1);
      let j_hSpace = canvas.width / (sizes.length+1);
      let x2 = j_hSpace*(l+2) - diameter/2;
      let y2 = j_vSpace*(j+1) - diameter/2;
      utils.drawLine(ctx, {x: x1, y: y1}, {x: x2, y: y2}, { color: "red", lineWidth: 1 })
    }
  }
}

for (let l=0; l<sizes.length; l++) {
  let n = sizes[l];
  let diameter = 10;
  let hSpace = canvas.height / (n+1);
  let vSpace = canvas.width / (sizes.length+1);

  for (let i=0; i<n; i++) {
    let x = vSpace*(l+1) - diameter/2;
    let y = hSpace*(i+1) - diameter/2;
    utils.drawCircle(ctx, {x: x, y: y}, {radius:10, color:"green", borderColor:"white", lineWidth:1.3})
  }
}

