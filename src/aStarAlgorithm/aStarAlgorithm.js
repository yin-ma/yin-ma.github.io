import { Grid } from "./grid.js";
import { MinHeap } from "./libs/priorityQueue.js";

let canvas = document.querySelector(".canvas");
let numGrid = 12;
let grid = new Grid(canvas, numGrid, numGrid);

grid.grid[3][3].state = grid.gridType.start;
grid.grid[9][9].state = grid.gridType.end;
grid.grid[8][4].state = grid.gridType.wall;
grid.grid[7][5].state = grid.gridType.wall;
grid.grid[6][6].state = grid.gridType.wall;
grid.grid[5][7].state = grid.gridType.wall;
grid.grid[4][8].state = grid.gridType.wall;
grid.grid[0][0].state = grid.gridType.open;
grid.grid[0][1].state = grid.gridType.close;
grid.draw();

astar();


function astar() {
  let openList = [];
  let closeList = new Set();
}
