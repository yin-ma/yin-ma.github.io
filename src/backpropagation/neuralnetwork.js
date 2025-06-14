import * as utils from "./utils.js"

export class NeuralNetwork {
  constructor(sizes) {
    this.sizes = sizes;
    this.mode = "train";
    this.lr = 0.03;

    this.weights = Array.from({ length: this.sizes.length-1 }, (_, idx) => {
      return Array.from({ length: this.sizes[idx+1] }, () => Array(this.sizes[idx]).fill(Math.random()*2-1));
    })

    this.biases = Array.from({ length: this.sizes.length-1 }, (_, idx) => {
      return Array.from({ length: this.sizes[idx+1] }, () => Array(1).fill(Math.random()*2-1));
    })

    this.activation = Array.from({ length: this.sizes.length-1 }, (_, idx) => {
      return Array.from({ length: this.sizes[idx+1] }, () => Array(1).fill(0));
    })

    this.weights_grad = Array.from({ length: this.sizes.length-1 }, (_, idx) => {
      return Array.from({ length: this.sizes[idx+1] }, () => Array(this.sizes[idx]).fill(0));
    })

    this.biases_gard = Array.from({ length: this.sizes.length-1 }, (_, idx) => {
      return Array.from({ length: this.sizes[idx+1] }, () => Array(1).fill(0));
    })

    this.input;
  }

  train() {
    this.mode = "train";
  }

  eval() {
    this.mode = "eval";
  }

  zero_grad() {
    this.weights_grad = Array.from({ length: this.sizes.length-1 }, (_, idx) => {
      return Array.from({ length: this.sizes[idx+1] }, () => Array(this.sizes[idx]).fill(0));
    })

    this.biases_gard = Array.from({ length: this.sizes.length-1 }, (_, idx) => {
      return Array.from({ length: this.sizes[idx+1] }, () => Array(1).fill(0));
    })
  }



  getWeight(l, i, j) {
    // idx of (l: layer, i: input neural, output: neural)
    return this.weights[l][j][i];
  }

  getBias(l, i) {
    // idx of (l: layer, i: neural)
    return this.biases[l][i][0];
  }

  setWeight(l, i, j, v) {
    this.weights[l][j][i] = v;
  }

  setBias(l, i, v) {
    this.biases[l][i][0] = v;
  }

  sigmoid(x) {
    return 1 / (1+Math.exp(-x));
  }

  sigmoid_derivative(x) {
    return x * (1-x);
  }

  forward(a) {
    // reset activation
    if (this.mode == "train") {
      this.input = a;
      this.activation = Array.from({ length: this.sizes.length-1 }, (_, idx) => {
        return Array.from({ length: this.sizes[idx+1] }, () => Array(1).fill(0));
      })
    }

    let activation = a;
    for (let l=0; l<this.weights.length; l++) {
      activation = utils.matmul(this.weights[l], activation);
      activation = utils.add(activation, this.biases[l]);
      activation = utils.map(activation, this.sigmoid);

      if (this.mode == "train") {
        this.activation[l] = utils.copy(activation);
      }
    }
    return activation;
  }

  step() {
    for (let l = 0; l < this.weights.length; l++) {
      this.weights[l] = utils.add(this.weights[l], utils.mul(this.weights_grad[l], -this.lr));
      this.biases[l] = utils.add(this.biases[l], utils.mul(this.biases_gard[l], -this.lr));
    }
  }

  backward(t) {

    let deltas = []

    let gradient_C_a = utils.add(this.activation[this.activation.length-1], utils.mul(t, -1));
    let act_derivative_L = utils.map(this.activation[this.activation.length-1], this.sigmoid_derivative);
    let delta_L = utils._mul(gradient_C_a, act_derivative_L);

    let delta_l = delta_L;
    deltas.push(delta_l);
    for (let l=this.weights.length-1; l>0; l--) {
      delta_l = utils.matmul(utils.transpose(this.weights[l]), delta_l);

      let act_derivative_l = utils.map(this.activation[l-1], this.sigmoid_derivative);
      delta_l = utils._mul(delta_l, act_derivative_l);

      deltas.push(delta_l)
    }

    let delta_0 = utils.matmul(utils.transpose(this.weights[0]), delta_l);
    deltas.push(delta_0);

    deltas.reverse();

    for (let l = 0; l < this.weights.length; l++) {
      let prev_activation = l === 0 ? this.input : this.activation[l-1];
      let dc_dw_l = utils.matmul(deltas[l+1], utils.transpose(prev_activation));
      this.weights_grad[l] = utils.add(this.weights_grad[l], dc_dw_l);
      this.biases_gard[l] = utils.add(this.biases_gard[l], deltas[l+1]);
    }
  }
}

