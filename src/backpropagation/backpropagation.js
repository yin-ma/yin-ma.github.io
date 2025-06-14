import { NeuralNetwork } from "./neuralnetwork.js"
import * as utils from "./utils.js"

let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 450;


let sizes = [1, 4, 4, 1];
let model = new NeuralNetwork(sizes);
let epochs = 5000;
let batches = 16;


model.train();
for (let e=0; e<epochs; e++) {
  model.zero_grad();
  
  let loss = 0;
  for (let b=0; b<batches; b++) {
    let x_train = Math.random(); // [0, 10]
    let y_train = targetFunction(x_train);

    let x = [[x_train]];
    let y = model.forward(x);
    loss += (y[0][0] - y_train) ** 2;
    model.backward([[y_train]]);
  }

  model.step()
  if (e % 100 === 0) {
    console.log(`Epoch: ${e}, Loss: ${loss/batches}`);
  } 
}

model.eval();
for (let i=0; i<11; i++) {
  let x_test = [[i*0.1]];
  let y_test = model.forward(x_test);
  console.log(`target: ${(targetFunction(x_test)).toFixed(2)}, predict: ${(y_test[0][0]).toFixed(2)}`);
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


function targetFunction(x) {
  return x**2;
}