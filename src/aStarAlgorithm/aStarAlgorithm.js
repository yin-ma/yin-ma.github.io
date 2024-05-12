import { Grid } from "./grid.js";
import { MinHeap } from "./libs/priorityQueue.js";

let canvas = document.querySelector(".canvas");
let numGrid = 12;
let gridsize = canvas.getBoundingClientRect().width / numGrid;
let grid = new Grid(canvas, numGrid, numGrid);


grid.grid[3][3].state = grid.gridType.start;
grid.grid[4][4].state = grid.gridType.end;
grid.grid[5][5].state = grid.gridType.wall;
grid.grid[6][6].state = grid.gridType.open;
grid.grid[7][7].state = grid.gridType.close;
grid.draw();

// function astar() {
//   let openList = [];
//   let closeList = [];
// }
