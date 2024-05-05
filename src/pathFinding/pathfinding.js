import { bfs } from "./bfs.js";
import { dfs } from "./dfs.js";
import { dijkstra } from "./dijkstra.js";
import { gbfs } from "./gbfs.js";
import { astar } from "./astar.js";


const tile = {
  space: 0,
  wall: 1,
  start: 2,
  end: 3
}

let canvas = document.querySelector(".canvas");
let algos = document.querySelector(".algos");
let speedSlider = document.querySelector(".speed-slider");
let clearBtn = document.querySelector(".clear-btn");
let startBtn = document.querySelector(".start-btn");
let grid = [];
let elementGrid = [];

const gridSize = 30;
let startRow = 10;
let startCol = 10;
let endRow = 20;
let endCol = 20;
let speed = 1;

let startIsDragging = false;
let endIsDragging = false;
let buildWall = false;
let removeWall = false;

gridInit();

startBtn.addEventListener("click", async () => {
  canvas.disabled = true;
  algos.disabled = true;
  clearBtn.disabled = true;
  startBtn.disabled = true;

  elementGrid.forEach(row => {
    row.forEach(e => {
      e.classList.remove("open");
      e.classList.remove("path");
    })
  });

  let ani;
  let path;

  switch (algos.options[algos.selectedIndex].value) {
    case "BFS":
      [ani, path] = await bfs(startRow, startCol, endRow, endCol, grid, tile);
      break;
    case "DFS":
      [ani, path] = await dfs(startRow, startCol, endRow, endCol, grid, tile);
      break;
    case "Dijkstra":
      [ani, path] = await dijkstra(startRow, startCol, endRow, endCol, grid, tile);
      break;
    case "GBFS":
      [ani, path] = await gbfs(startRow, startCol, endRow, endCol, grid, tile);
      break;
    case "AStar":
      [ani, path] = await astar(startRow, startCol, endRow, endCol, grid, tile);
      break;
    default:
      break;
  }

  await renderOpenList(ani);
  await renderPath(path);
  canvas.disabled = false;
  algos.disabled = false;
  clearBtn.disabled = false;
  startBtn.disabled = false;
})

speedSlider.addEventListener("input", () => {
  speed = parseInt(speedSlider.getAttribute("max")) - speedSlider.value;
})


clearBtn.addEventListener("click", () => {
  elementGrid.forEach(row => {
    row.forEach(e => {
      e.classList.remove("open");
      e.classList.remove("path");
    })
  });
})

clearBtn.addEventListener("dblclick", () => {
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
    event.target.classList.remove("open");
    event.target.classList.remove("path");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.space;
  }
  else {
    buildWall = true;
    event.target.classList.add("wall");
    event.target.classList.remove("open");
    event.target.classList.remove("path");
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
    event.target.classList.remove("open");
    event.target.classList.remove("path");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.start;
  }
  else if (endIsDragging === true) {
    if (event.target.classList.contains("start")) return;
    event.target.classList.add("end");
    event.target.classList.remove("wall");
    event.target.classList.remove("open");
    event.target.classList.remove("path");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.end;
  } 
  else if (buildWall === true) {
    if (event.target.classList.contains("start") || event.target.classList.contains("end")) return ;
    event.target.classList.add("wall");
    event.target.classList.remove("open");
    event.target.classList.remove("path");
    grid[parseInt(event.target.getAttribute("row"))][parseInt(event.target.getAttribute("col"))] = tile.wall;
  }
  else if (removeWall === true) {
    event.target.classList.remove("wall");
    event.target.classList.remove("open");
    event.target.classList.remove("path");
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


async function renderOpenList(ani) {
  for (let temp of ani) {
    let [tempRow, tempCol] = temp;

    if ((tempRow === startRow && tempCol === startCol) || (tempRow === endRow && tempCol === endCol)) continue;
    elementGrid[tempRow][tempCol].classList.add("open");
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}


async function renderPath(path) {
  let currRow = endRow;
  let currCol = endCol;

  if (!(`${currRow},${currCol}` in path)) return;

  while (true) {
    let temp = path[`${currRow},${currCol}`].split(",");
    currRow = parseInt(temp[0]);
    currCol = parseInt(temp[1]);
    if (currRow === startRow && currCol === startCol) break;

    elementGrid[currRow][currCol].classList.remove("open");
    elementGrid[currRow][currCol].classList.add("path");
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}

