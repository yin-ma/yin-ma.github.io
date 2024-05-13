import { Grid } from "./grid.js";
import { MinHeap } from "./libs/priorityQueue.js";

let canvas = document.querySelector(".canvas");
let numGrid = 12;
let grid = new Grid(canvas, numGrid, numGrid);
let startRow = 3;
let startCol = 3;
let endRow = 8;
let endCol = 8;

let action = {
  start: false,
  end: false,
  wall: false,
  space: false
}

let speedSlider = document.querySelector(".speed-slider");
let clearBtn = document.querySelector(".clear-btn");
let startBtn = document.querySelector(".start-btn");
let aniSpeed = parseInt(speedSlider.getAttribute("max")) - speedSlider.value;
let showBtn = document.querySelector(".show-btn");

grid.grid[startRow][startCol].state = grid.gridType.start;
grid.grid[endRow][endCol].state = grid.gridType.end;
grid.grid[7][4].state = grid.gridType.wall;
grid.grid[6][5].state = grid.gridType.wall;
grid.grid[5][6].state = grid.gridType.wall;
grid.grid[4][7].state = grid.gridType.wall;
grid.grid[3][8].state = grid.gridType.wall;
grid.draw();

showBtn.addEventListener("click", event => {
  grid.showText = !grid.showText;
  grid.draw();
})

canvas.addEventListener("drag", event => {
  event.preventDefault();
})

canvas.addEventListener("dragstart", event => {
  event.preventDefault();
})

canvas.addEventListener("mousedown", event => {
  if (grid.drawing) return;
  event.stopPropagation();
  grid.reset();
  if (event.target.matches(".grid-col")) {
    let [targetRow, targetCol] = [parseInt(event.target.getAttribute("row")), parseInt(event.target.getAttribute("col"))];
    switch (grid.grid[targetRow][targetCol].state) {
      case grid.gridType.start:
        action.start = true;
        break;
      case grid.gridType.end:
        action.end = true;
        break;
      case grid.gridType.wall:
        action.space = true;
        grid.grid[targetRow][targetCol].state = grid.gridType.space;
        break;
      case grid.gridType.space:
        action.wall = true;
        grid.grid[targetRow][targetCol].state = grid.gridType.wall;
        break;
      default:
        break;
    }
  }
  grid.draw();
})

canvas.addEventListener("mouseup", event => {
  if (grid.drawing) return;
  event.stopPropagation();
  if (event.target.matches(".grid-col")) {
    let [targetRow, targetCol] = [parseInt(event.target.getAttribute("row")), parseInt(event.target.getAttribute("col"))];
    switch (grid.grid[targetRow][targetCol].state) {
      case grid.gridType.start:
        break;
      case grid.gridType.end:
        break;
      case grid.gridType.wall:
        break;
      case grid.gridType.space:
        break;
      default:
        break;
    }
    action.start = false;
    action.end = false;
    action.wall = false;
    action.space = false;
  }
})


canvas.addEventListener("mousemove", event => {
  if (grid.drawing) return;
  event.stopPropagation();
  if (event.target.matches(".grid-col")) {
    let [targetRow, targetCol] = [parseInt(event.target.getAttribute("row")), parseInt(event.target.getAttribute("col"))];
    switch (grid.grid[targetRow][targetCol].state) {
      case grid.gridType.start:
        break;
      case grid.gridType.end:
        break;
      case grid.gridType.wall:
        if (action.start) {
          grid.grid[startRow][startCol].state = grid.gridType.space;
          startRow = targetRow;
          startCol = targetCol;
          grid.grid[startRow][startCol].state = grid.gridType.start;
        }
        else if (action.end) {
          grid.grid[endRow][endCol].state = grid.gridType.space;
          endRow = targetRow;
          endCol = targetCol;
          grid.grid[endRow][endCol].state = grid.gridType.end;
        }
        else if (action.space) {
          grid.grid[targetRow][targetCol].state = grid.gridType.space;
        }
        break;
      case grid.gridType.space:
        if (action.start) {
          grid.grid[startRow][startCol].state = grid.gridType.space;
          startRow = targetRow;
          startCol = targetCol;
          grid.grid[startRow][startCol].state = grid.gridType.start;
        }
        else if (action.end) {
          grid.grid[endRow][endCol].state = grid.gridType.space;
          endRow = targetRow;
          endCol = targetCol;
          grid.grid[endRow][endCol].state = grid.gridType.end;
        }
        else if (action.wall) {
          grid.grid[targetRow][targetCol].state = grid.gridType.wall;
        }
        break;
      default:
        break;
    }
  }
  grid.draw();
})


speedSlider.addEventListener("input", event => {
  aniSpeed = parseInt(speedSlider.getAttribute("max")) - event.target.value;
})

clearBtn.addEventListener("click", () => {
  grid.reset();
  grid.draw();
})

startBtn.addEventListener("click", async () => {
  grid.drawing = true;
  clearBtn.disabled = true;
  startBtn.disabled = true;
  grid.reset();
  await astar();
  grid.drawing = false;
  clearBtn.disabled = false;
  startBtn.disabled = false;
})


async function astar() {
  // [fcost, row, col, gcost, hcost]
  let openList = [[heuristic(startRow, startCol), startRow, startCol, 0, heuristic(startRow, startCol)]];
  let closeList = new Set();
  let path = new Map();

  while (openList.length > 0) {
    let [fCost, row, col, gCost, hCost] = MinHeap.pop(openList);
    if (closeList.has(`${row},${col}`)) {
      continue;
    }
    if (row === endRow && col === endCol) {
      // reach end point
      let [currRow, currCol] = path[`${endRow},${endCol}`];
      while (currRow !== startRow || currCol !== startCol) {
        grid.grid[currRow][currCol].state = grid.gridType.path;
        [currRow, currCol] = path[`${currRow},${currCol}`];
        await new Promise(resolve => setTimeout(resolve, aniSpeed));
        grid.draw();
      }
      return;
    }
    closeList.add(`${row},${col}`);
    if ((row !== startRow || col !== startCol) && (row !== endRow || col !== endCol)) {
      grid.grid[row][col] = {state: grid.gridType.close, fCost: fCost, gCost: gCost, hCost: hCost};
    }

    let neighbour = [[0, -1], [-1, 0], [0, 1], [1, 0]];
    for (const [dr, dc] of neighbour) {
      let newRow = row+dr;
      let newCol = col+dc;
      // [newRow, newCol] should be transverible
      if (newRow >= 0 && newRow < numGrid && newCol >= 0 && newCol < numGrid && grid.grid[newRow][newCol].state !== grid.gridType.wall) {
        if (closeList.has(`${newRow},${newCol}`)) {
          continue;
        }
        let newHCost = heuristic(newRow, newCol);
        let newGCost = gCost + 1;
        let newFCost = newGCost + newHCost;
        MinHeap.push(openList, [newFCost, newRow, newCol, newGCost, newHCost]);
        if (grid.grid[newRow][newCol].fCost === -1 || grid.grid[newRow][newCol].fCost > newFCost) {
          if ((newRow !== startRow || newCol !== startCol) && (newRow !== endRow || newCol !== endCol)) {
            grid.grid[newRow][newCol] = {state: grid.gridType.open, fCost: newFCost, gCost: newGCost, hCost: newHCost};
          }
          path[`${newRow},${newCol}`] = [row, col];
        }
      }
    } 
    await new Promise(resolve => setTimeout(resolve, aniSpeed));
    grid.draw();
  }
}

function heuristic(row, col) {
  return Math.abs(row - endRow) + Math.abs(col - endCol);
}
