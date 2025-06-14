import { NeuralNetwork } from "./neuralnetwork.js"
import * as utils from "./utils.js"

let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 450;

let percentElement = document.querySelector(".percent");
let mseElement = document.querySelector(".mse");
let trainBtn = document.querySelector(".train");
let testBtn = document.querySelector(".test");

let sizes = [1, 4, 8, 4, 1];
let model = new NeuralNetwork(sizes);
let epochs = 5000;
let batches = 8;

trainBtn.addEventListener("click", () => train())
testBtn.addEventListener("click", () => test())

drawNetwork()

function test() {
  testBtn.disabled = true;
  trainBtn.disabled = true;
  model.eval();
  let loss = 0;
  for (let i=0; i<11; i++) {
    let x_test = [[i*0.1]];
    let y_test = model.forward(x_test);
    console.log(`target: ${(targetFunction(x_test)).toFixed(2)}, predict: ${(y_test[0][0]).toFixed(2)}`);

    loss += (y_test - targetFunction(x_test)) ** 2;
  }

  mseElement.innerHTML = `mse: ${(loss/10).toFixed(4)}`
  testBtn.disabled = false;
  trainBtn.disabled = false;

}

async function train() {
  trainBtn.disabled = true;
  testBtn.disabled = true;
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

    await new Promise(r => setTimeout(r, 1));
    drawNetwork()
    percentElement.innerHTML = `${(100*(e)/epochs).toFixed(2)}%`;
  }
  percentElement.innerHTML = "100%";
  trainBtn.disabled = false;
  testBtn.disabled = false;
}


function drawNetwork() {
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
  
        let alpha = 0.01*Math.min(Math.abs(model.getWeight(l, i, j)), 1.0);
        if (model.getWeight(l, i, j) < 0) {
          utils.drawLine(ctx, {x: x1, y: y1}, {x: x2, y: y2}, { color: `rgba(237, 131, 17, ${alpha})`, lineWidth: 1 })
        } else {
          utils.drawLine(ctx, {x: x1, y: y1}, {x: x2, y: y2}, { color: `rgba(255, 0, 0, ${alpha})`, lineWidth: 1 })
        }
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
}  


function targetFunction(x) {
  return x**2;
}