import { MinHeap } from "./libs/priorityQueue.js";


const tile = {
  space: 0,
  wall: 1,
  start: 2,
  end: 3
}

const gridSize = 30;
let startRow = 10;
let startCol = 10;
let endRow = 20;
let endCol = 20;


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
  elementGrid.forEach(row => {
    row.forEach(e => {
      e.classList.remove("open");
      e.classList.remove("path");
    })
  });

  switch (algos.options[algos.selectedIndex].value) {
    case "BFS":
      bfs();
      break;
    case "DFS":
      dfs();
      break;
    case "Dijkstra":
      dijkstra();
      break;
    case "GBFS":
      gbfs();
      break;
    case "AStar":
      astar();
      break;
    default:
      break;
  }
})

clearBtn.addEventListener("click", () => {
  gridInit();
})


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
  grid[startRow][startCol] = tile.start;
  grid[endRow][endCol] = tile.end;
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
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.space;
  }
  else {
    buildWall = true;
    event.target.classList.add("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.wall;
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
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.start;
  }
  else if (endIsDragging === true) {
    if (event.target.classList.contains("start")) return;
    event.target.classList.add("end");
    event.target.classList.remove("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.end;
  } 
  else if (buildWall === true) {
    if (event.target.classList.contains("start") || event.target.classList.contains("end")) return ;
    event.target.classList.add("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.wall;
  }
  else if (removeWall === true) {
    event.target.classList.remove("wall");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.space;
  }
  event.stopPropagation();
})


document.addEventListener("mouseout" , event => {
  if (!event.target.classList.contains("grid")) return;

  if (startIsDragging === true) {
    event.target.classList.remove("start");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.space;
  }
  else if (endIsDragging === true) {
    event.target.classList.remove("end");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.space;
  }
  event.stopPropagation();
})



async function bfs() {
  let openList = [[startRow, startCol]];
  let closeList = new Set();
  let ani = [];
  let path = {};

  while (openList.length > 0) {
    let [currRow, currCol] = openList.shift();
    
    if (currRow === endRow && currCol === endCol) break;
    if (closeList.has(`${currRow},${currCol}`)) continue;
    closeList.add(`${currRow},${currCol}`); 

    let direction = [[0, -1], [-1, 0], [1, 0], [0, 1]];
    for (let [dr, dc] of direction) {
      let nxtRow = currRow + dr;
      let nxtCol = currCol + dc;
      if (nxtRow < 0 || nxtRow >= gridSize || nxtCol < 0 || nxtCol >= gridSize) continue;
      if (closeList.has(`${nxtRow},${nxtCol}`)) continue;
      if (grid[nxtRow][nxtCol] === tile.wall) continue;
      openList.push([nxtRow, nxtCol]);
      ani.push([nxtRow, nxtCol])
      path[`${nxtRow},${nxtCol}`] = `${currRow},${currCol}`;
    }
  }

  for (let temp of ani) {
    let [tempRow, tempCol] = temp;

    if ((tempRow === startRow && tempCol === startCol) || (tempRow === endRow && tempCol === endCol)) continue;
    elementGrid[tempRow][tempCol].classList.add("open");
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  let currRow = endRow;
  let currCol = endCol;

  while (true) {
    let temp = path[`${currRow},${currCol}`].split(",");
    currRow = parseInt(temp[0]);
    currCol = parseInt(temp[1]);
    if (currRow === startRow && currCol === startCol) break;

    elementGrid[currRow][currCol].classList.remove("open");
    elementGrid[currRow][currCol].classList.add("path");
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}


async function dfs() {
  let openList = [[startRow, startCol]];
  let closeList = new Set();
  let ani = [];
  let path = {};

  while (openList.length > 0) {
    let [currRow, currCol] = openList.pop();
    
    if (currRow === endRow && currCol === endCol) break;
    if (closeList.has(`${currRow},${currCol}`)) continue;
    closeList.add(`${currRow},${currCol}`);

    let direction = [[0, -1], [-1, 0], [1, 0], [0, 1]];
    for (let [dr, dc] of direction) {
      let nxtRow = currRow + dr;
      let nxtCol = currCol + dc;
      if (nxtRow < 0 || nxtRow >= gridSize || nxtCol < 0 || nxtCol >= gridSize) continue;
      if (closeList.has(`${nxtRow},${nxtCol}`)) continue;
      if (grid[nxtRow][nxtCol] === tile.wall) continue;
      openList.push([nxtRow, nxtCol]);
      ani.push([nxtRow, nxtCol])
      path[`${nxtRow},${nxtCol}`] = `${currRow},${currCol}`;
    }
  }


  for (let temp of ani) {
    let [tempRow, tempCol] = temp;

    if ((tempRow === startRow && tempCol === startCol) || (tempRow === endRow && tempCol === endCol)) continue;
    elementGrid[tempRow][tempCol].classList.add("open");
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  let currRow = endRow;
  let currCol = endCol;

  while (true) {
    let temp = path[`${currRow},${currCol}`].split(",");
    currRow = parseInt(temp[0]);
    currCol = parseInt(temp[1]);
    if (currRow === startRow && currCol === startCol) break;

    elementGrid[currRow][currCol].classList.remove("open");
    elementGrid[currRow][currCol].classList.add("path");
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}


async function dijkstra() {
  let openList = [[0, startRow, startCol]];
  let closeList = new Set();
  let ani = [];
  let path = {};

  while (openList.length > 0) {
    let [gCost, currRow, currCol] = MinHeap.pop(openList);
    
    if (currRow === endRow && currCol === endCol) break;
    if (closeList.has(`${currRow},${currCol}`)) continue;
    closeList.add(`${currRow},${currCol}`);

    let direction = [[0, -1], [-1, 0], [1, 0], [0, 1]];
    for (let [dr, dc] of direction) {
      let nxtRow = currRow + dr;
      let nxtCol = currCol + dc;
      if (nxtRow < 0 || nxtRow >= gridSize || nxtCol < 0 || nxtCol >= gridSize) continue;
      if (grid[nxtRow][nxtCol] === tile.wall) continue;
      if (closeList.has(`${nxtRow},${nxtCol}`)) continue;
      MinHeap.push(openList, [gCost+1, nxtRow, nxtCol]);
      ani.push([nxtRow, nxtCol]);
      path[`${nxtRow},${nxtCol}`] = `${currRow},${currCol}`;
    }
  }


  for (let temp of ani) {
    let [tempRow, tempCol] = temp;

    if ((tempRow === startRow && tempCol === startCol) || (tempRow === endRow && tempCol === endCol)) continue;
    elementGrid[tempRow][tempCol].classList.add("open");
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  let currRow = endRow;
  let currCol = endCol;

  while (true) {
    let temp = path[`${currRow},${currCol}`].split(",");
    currRow = parseInt(temp[0]);
    currCol = parseInt(temp[1]);
    if (currRow === startRow && currCol === startCol) break;

    elementGrid[currRow][currCol].classList.remove("open");
    elementGrid[currRow][currCol].classList.add("path");
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}


async function gbfs() {
  function heuristic(pr1, pc1, pr2, pc2) {
    return Math.abs(pr2-pr1) + Math.abs(pc2-pc1);
  }
  let openList = [[heuristic(startRow, startCol, endRow, endCol), startRow, startCol]];
  let closeList = {};
  let ani = [];
  let path = {};
  path[`${startRow},${startCol}`] = `${startRow},${startCol}`;

  while (openList.length > 0) {
    let [hcost, currRow, currCol] = MinHeap.pop(openList);
    
    if (currRow === endRow && currCol === endCol) break;

    if ((`${currRow},${currCol}` in closeList) && closeList[`${currRow},${currCol}`] >= hcost) continue;
    closeList[`${currRow},${currCol}`] = hcost;
    
    let direction = [[0, -1], [-1, 0], [1, 0], [0, 1]];
    for (let [dr, dc] of direction) {
      let nxtRow = currRow + dr;
      let nxtCol = currCol + dc;
      if (nxtRow < 0 || nxtRow >= gridSize || nxtCol < 0 || nxtCol >= gridSize) continue;
      if (grid[nxtRow][nxtCol] === tile.wall) continue;
      MinHeap.push(openList, [heuristic(nxtRow, nxtCol, endRow, endCol), nxtRow, nxtCol]);
      ani.push([nxtRow, nxtCol])
      if ((`${nxtRow},${nxtCol}` in closeList) && closeList[`${nxtRow},${nxtCol}`] >= heuristic(nxtRow, nxtCol, endRow, endCol)) continue;
      path[`${nxtRow},${nxtCol}`] = `${currRow},${currCol}`;
    }
  }

  for (let temp of ani) {
    let [tempRow, tempCol] = temp;

    if ((tempRow === startRow && tempCol === startCol) || (tempRow === endRow && tempCol === endCol)) continue;
    elementGrid[tempRow][tempCol].classList.add("open");
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  let currRow = endRow;
  let currCol = endCol;

  while (true) {
    let temp = path[`${currRow},${currCol}`].split(",");
    currRow = parseInt(temp[0]);
    currCol = parseInt(temp[1]);
    if (currRow === startRow && currCol === startCol) break;

    elementGrid[currRow][currCol].classList.remove("open");
    elementGrid[currRow][currCol].classList.add("path");
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}


async function astar() {
  function heuristic(pr1, pc1, pr2, pc2) {
    return Math.abs(pr2-pr1) + Math.abs(pc2-pc1);
  }
  let openList = [[heuristic(startRow, startCol, endRow, endCol), 0, heuristic(startRow, startCol, endRow, endCol), startRow, startCol, startRow, startCol]];
  let closeList = {};
  let ani = [];
  let pathRecord = {};

  while (openList.length > 0) {
    let [fCost, gCost, hCost, currRow, currCol, prevRow, prevCol] = MinHeap.pop(openList);
    
    if (`${currRow},${currCol}` in closeList && closeList[`${currRow},${currCol}`] <= gCost) continue;
    closeList[`${currRow},${currCol}`] = gCost;
    pathRecord[`${currRow},${currCol}`] = `${prevRow},${prevCol}`;
    
    if (currRow === endRow && currCol === endCol) break;
    
    let direction = [[0, -1], [-1, 0], [1, 0], [0, 1]];
    for (let [dr, dc] of direction) {
      let nxtRow = currRow + dr;
      let nxtCol = currCol + dc;
      if (nxtRow < 0 || nxtRow >= gridSize || nxtCol < 0 || nxtCol >= gridSize) continue;
      if (grid[nxtRow][nxtCol] === tile.wall) continue;
      if (`${nxtRow},${nxtCol}` in closeList) continue;
      
      MinHeap.push(openList, [gCost+heuristic(nxtRow, nxtCol, endRow, endCol)+1, gCost+1, heuristic(nxtRow, nxtCol, endRow, endCol), nxtRow, nxtCol, currRow, currCol]);
      ani.push([nxtRow, nxtCol])
    }
  }

  for (let temp of ani) {
    let [tempRow, tempCol] = temp;

    if ((tempRow === startRow && tempCol === startCol) || (tempRow === endRow && tempCol === endCol)) continue;
    elementGrid[tempRow][tempCol].classList.add("open");
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  let currRow = endRow;
  let currCol = endCol;
  while (true) {
    let temp = pathRecord[`${currRow},${currCol}`].split(",");
    currRow = parseInt(temp[0]);
    currCol = parseInt(temp[1]);
    if (currRow === startRow && currCol === startCol) break;

    elementGrid[currRow][currCol].classList.remove("open");
    elementGrid[currRow][currCol].classList.add("path");
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

