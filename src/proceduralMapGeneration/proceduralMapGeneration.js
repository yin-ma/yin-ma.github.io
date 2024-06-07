let canvas = document.querySelector(".canvas");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
let numRow = 15;
let numCol = 7;
let margin = 40;
let nodeSize = 15;
let horizontalGridSize = (canvasWidth - 2*margin) / (numCol - 1);
let verticleGridSize = (canvasHeight - 2*margin) / (numRow - 1);

let nodes = new Array(numRow);

initMap();

function initMap() {
  nodes = new Array(numRow);
  for (let r=0; r<numRow; r++) {
    let temp = [];
    for (let c=0; c<numCol; c++) {
      let div = document.createElement("div");
      div.style.position = "absolute";
      div.style.width = `${nodeSize}px`;
      div.style.height = `${nodeSize}px`;
      div.style.borderRadius = "100%";
      div.style.left = `${margin + horizontalGridSize*c - nodeSize/2}px`;
      div.style.top = `${margin + verticleGridSize*r - nodeSize}px`;
      div.style.backgroundColor = "orange";
      canvas.appendChild(div);
      temp.push(div);
    }
    nodes[numRow-1-r] = temp;
  }
}
