let canvas = document.querySelector(".canvas");
let regenBtn = document.querySelector(".regen");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
let numRow = 15;
let numCol = 7;
let margin = 80;
let nodeSize = 15;
let horizontalGridSize = (canvasWidth - 2*margin) / (numCol - 1);
let verticleGridSize = (canvasHeight - 2*margin) / (numRow - 1);

let nodes = new Array(numRow);

let eventColor = {
  monster: "orange",
  elite: "red",
  shop: "blue",
  treasure: "gold",
  campfire: "green",
  event: "purple"
}

initMap();

function initMap() {
  canvas.innerHTML = "";
  nodes = new Array(numRow);
  genGrid();
  for (let i=0; i<6; i++) {
    genPath();
  }
}

function genGrid() {
  for (let r=0; r<numRow; r++) {
    let temp = [];
    for (let c=0; c<numCol; c++) {
      let tempNode = new Node(r, c, "none");
      tempNode.initHtml(canvas, nodeSize, margin, horizontalGridSize, verticleGridSize);
      temp.push(tempNode);
    }
    nodes[r] = temp;
  }
}

function genPath() {
  let currentRow = 0;
  let currentCol = Math.floor(Math.random()*(numCol));

  nodes[currentRow][currentCol].setVisible();
  nodes[currentRow][currentCol].setType("monster");
  nodes[currentRow][currentCol].setColor(eventColor["monster"]);

  // roll the next node
  for (let r=1; r<numRow; r++) {
    let dc = Math.floor(Math.random()*3-1);
    newCol = currentCol + dc;
    if (newCol < 0) newCol = 0;
    if (newCol >= numCol) newCol = numCol - 1;

    // check if any cross path ("/")
    if ((currentCol < numCol-1) && (newCol - currentCol === 1)) {
      let rightNode = nodes[currentRow][currentCol+1];
      for (let i=0; i<rightNode.next.length; i++) {
        if (rightNode.next[i].col === currentCol) {
          newCol = currentCol;
        }
      }
    }

    // check if any cross path ("\")
    if ((currentCol > 0) && (newCol - currentCol === -1)) {
      let leftNode = nodes[currentRow][currentCol-1];
      for (let i=0; i<leftNode.next.length; i++) {
        if (leftNode.next[i].col === currentCol) {
          newCol = currentCol;
        }
      }
    }

    // draw edges bewteen nodes
    if (newCol - currentCol === -1) {
      nodes[currentRow][currentCol].setLeftPath();
    }
    else if (newCol === currentCol) {
      nodes[currentRow][currentCol].setMidPath();
    }
    else if (newCol - currentCol === 1) {
      nodes[currentRow][currentCol].setRightPath();
    }

    // append child node to current node
    if (!nodes[currentRow][currentCol].next.includes(nodes[r][newCol])) {
      nodes[currentRow][currentCol].next.push(nodes[r][newCol]);
      nodes[r][newCol].setVisible();

      if (nodes[r][newCol].type === "none") {
        // set node type
        if (r === parseInt(numRow/2)) {
          nodes[r][newCol].setType("treasure");
          nodes[r][newCol].setColor(eventColor["treasure"]);
        }
        else if (r === numRow-1) {
          nodes[r][newCol].setType("campfire");
          nodes[r][newCol].setColor(eventColor["campfire"]);
        }
        else if (r < 4) {
          let eventList = ["monster", "shop", "event"];
          while (true) {
            let idx = getRandomIndexByProbability([0.6, 0.1, 0.15]);
            if (nodes[currentRow][currentCol].type === eventList[idx] && nodes[currentRow][currentCol].type === "shop") {
              continue;
            }
            else {
              nodes[r][newCol].setType(eventList[idx]);
              nodes[r][newCol].setColor(eventColor[eventList[idx]]);
              break;
            }
          }
        }
        else {
          let eventList = ["monster", "shop", "event", "campfire", "elite"];
          let flag = true;
          while (flag) {
            let idx = getRandomIndexByProbability([0.52, 0.08, 0.13, 0.12, 0.25]);
            if (r === numRow-2 && eventList[idx] === "campfire") continue;
            nodes[r][newCol].setType(eventList[idx]);
            nodes[r][newCol].setColor(eventColor[eventList[idx]]);

            flag = false;
            if (nodes[currentRow][currentCol].type === "shop" || nodes[currentRow][currentCol].type === "campfire" || nodes[currentRow][currentCol].type === "elite") {
              for (let i=0; i<nodes[currentRow][currentCol].next.length; i++) {
                if (nodes[currentRow][currentCol].type === nodes[currentRow][currentCol].next[i].type) {
                  let idx = getRandomIndexByProbability([0.05, 0.1, 0.05, 0.1, 0.6]);
                  nodes[currentRow][currentCol].next[i].setType(eventList[idx]);
                  nodes[currentRow][currentCol].next[i].setColor(eventColor[eventList[idx]]);
                  flag = true;
                }
              }
            }
          }
        }
      }
    }

    currentRow = r;
    currentCol = newCol;
  }
}

function getRandomIndexByProbability(probabilities) {
  // from: https://stackoverflow.com/questions/8877249/generate-random-integers-with-probabilities
  var r = Math.random(),
      index = probabilities.length - 1;

  probabilities.some(function (probability, i) {
      if (r < probability) {
          index = i;
          return true;
      }
      r -= probability;
  });
  return index;
}

regenBtn.addEventListener("click", event => {
  initMap();
})