const Grid = {
  space: 0,
  wall: 1,
  start: 2,
  end: 3
}

const gridSize = 30;
let startRow = 3;
let startCol = 3;
let endRow = 5;
let endCol = 5;
// let endRow = gridSize-3;
// let endCol = gridSize-3;

let canvas = document.querySelector(".canvas");
let algos = document.querySelector(".algos");
let clearBtn = document.querySelector(".clear-btn");
let startBtn = document.querySelector(".start-btn");
let grid = [];
let elementGrid = [];

let startIsDragging = false;
let endIsDragging = false;
let buildWall = false;
let removeWall = false;

gridInit();

startBtn.addEventListener("click", () => {
  switch (algos.options[algos.selectedIndex].value) {
    case "BFS":
      bfs();
      break;
    case "DFS":
      dfs();
      break;
    case "Dijkstra":
      break;
    case "AStar":
      break;
    default:
      break;
  }
})

clearBtn.addEventListener("click", () => {
  gridInit();
})


async function bfs() {
  let openList = [[startRow, startCol]];
  let closeList = new Set();
  let path = {};
  // closeList.add(`${startRow},${startCol}`);

  while (openList.length > 0) {
    let [currRow, currCol] = openList.shift();

    if (closeList.has(`${currRow},${currCol}`)) continue;
    closeList.add(`${currRow},${currCol}`);

    if (currRow === endRow && currCol === endCol) break;

    let direction = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [dr, dc] of direction) {
      let nxtRow = currRow + dr;
      let nxtCol = currCol + dc;
      if (nxtRow < 0 || nxtRow >= gridSize || nxtCol < 0 || nxtCol >= gridSize) continue;
      if (closeList.has(`${nxtRow},${nxtCol}`)) continue;
      openList.push([nxtRow, nxtCol]);
      path[`${nxtRow},${nxtCol}`] = `${currRow},${currCol}`;
      closeList.add(`${currRow},${currCol}`);
    }
  }


  for (let temp of closeList) {
    let [tempRow, tempCol] = temp.split(",").map(e => parseInt(e));

    if ((tempRow === startRow && tempCol === startCol) || (tempRow === endRow && tempCol === endCol)) continue;
    elementGrid[tempRow][tempCol].classList.add("close");
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  let currRow = endRow;
  let currCol = endCol;

  while (true) {
    let temp = path[`${currRow},${currCol}`].split(",");
    currRow = parseInt(temp[0]);
    currCol = parseInt(temp[1]);
    if (currRow === startRow && currCol === startCol) break;

    elementGrid[currRow][currCol].classList.remove("close");
    elementGrid[currRow][currCol].classList.add("path");
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}


async function dfs() {
  let openList = [[startRow, startCol]];
  let closeList = new Set();
  let path = {};
  // closeList.add(`${startRow},${startCol}`);

  while (openList.length > 0) {
    let [currRow, currCol] = openList.pop();

    if (closeList.has(`${currRow},${currCol}`)) continue;
    closeList.add(`${currRow},${currCol}`);

    if (currRow === endRow && currCol === endCol) break;

    let direction = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [dr, dc] of direction) {
      let nxtRow = currRow + dr;
      let nxtCol = currCol + dc;
      if (nxtRow < 0 || nxtRow >= gridSize || nxtCol < 0 || nxtCol >= gridSize) continue;
      if (closeList.has(`${nxtRow},${nxtCol}`)) continue;
      openList.push([nxtRow, nxtCol]);
      path[`${nxtRow},${nxtCol}`] = `${currRow},${currCol}`;
    }
  }


  for (let temp of closeList) {
    let [tempRow, tempCol] = temp.split(",").map(e => parseInt(e));

    if ((tempRow === startRow && tempCol === startCol) || (tempRow === endRow && tempCol === endCol)) continue;
    elementGrid[tempRow][tempCol].classList.add("close");
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  let currRow = endRow;
  let currCol = endCol;

  while (true) {
    let temp = path[`${currRow},${currCol}`].split(",");
    currRow = parseInt(temp[0]);
    currCol = parseInt(temp[1]);
    if (currRow === startRow && currCol === startCol) break;

    elementGrid[currRow][currCol].classList.remove("close");
    elementGrid[currRow][currCol].classList.add("path");
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function gridInit() {
  canvas.innerHTML = "";
  grid = [];
  elementGrid = [];
  for (let i=0; i<gridSize; i++) {
    let gridRow = [];
    let elementGridRow = [];
    for (let j=0; j<gridSize; j++) {
      let div = document.createElement("div");
      div.classList.add("grid");
      div.setAttribute("row", i);
      div.setAttribute("col", j);
      canvas.appendChild(div);
      gridRow.push(0);
      elementGridRow.push(div);
    }
    grid.push(gridRow);
    elementGrid.push(elementGridRow);
  }
  
  elementGrid[startRow][startCol].classList.add("start");
  elementGrid[endRow][endCol].classList.add("end");
  grid[startRow][startCol] = Grid.start;
  grid[endRow][endCol] = Grid.end;
}


document.addEventListener("drag", event => {
  event.preventDefault();
})

document.addEventListener("dragstart", event => {
  event.preventDefault();
})

document.addEventListener("mousedown", event =>{
  event.stopPropagation();
  if (!event.target.classList.contains("grid")) return;

  if (event.target.classList.contains("start")) {
    startIsDragging = true;
  } 
  else if (event.target.classList.contains("end")) {
    endIsDragging = true;
  }
  else if (event.target.classList.contains("wall")) {
    removeWall = true;
    event.target.classList.remove("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = Grid.space;
  }
  else {
    buildWall = true;
    event.target.classList.add("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = Grid.wall;
  }
})


document.addEventListener("mouseup", event =>{
  event.stopPropagation();
  if (!event.target.classList.contains("grid")) return;

  if (startIsDragging) {
    startRow = parseInt(event.target.getAttribute("row"));
    startCol = parseInt(event.target.getAttribute("col"));
  }
  else if (endIsDragging) {
    endRow = parseInt(event.target.getAttribute("row"));
    endCol = parseInt(event.target.getAttribute("col"));
  }

  startIsDragging = false;
  endIsDragging = false;
  buildWall = false;
  removeWall = false;
})

document.addEventListener("mouseover", event => {
  if (!event.target.classList.contains("grid")) return;

  if (startIsDragging === true) {
    if (event.target.classList.contains("end")) return;
    event.target.classList.add("start");
    event.target.classList.remove("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = Grid.start;
  }
  else if (endIsDragging === true) {
    if (event.target.classList.contains("start")) return;
    event.target.classList.add("end");
    event.target.classList.remove("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = Grid.end;
  } 
  else if (buildWall === true) {
    if (event.target.classList.contains("start") || event.target.classList.contains("end")) return ;
    event.target.classList.add("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = Grid.wall;
  }
  else if (removeWall === true) {
    event.target.classList.remove("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = Grid.space;
  }
  event.stopPropagation();
})


document.addEventListener("mouseout" , event => {
  if (!event.target.classList.contains("grid")) return;

  if (startIsDragging === true) {
    event.target.classList.remove("start");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = Grid.space;
  }
  else if (endIsDragging === true) {
    event.target.classList.remove("end");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = Grid.space;
  }
  event.stopPropagation();
})