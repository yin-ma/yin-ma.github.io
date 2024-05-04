import { MinHeap } from "./libs/priorityQueue.js";

export async function dijkstra(startRow, startCol, endRow, endCol, grid, tile) {
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
      if (nxtRow < 0 || nxtRow >= grid.length || nxtCol < 0 || nxtCol >= grid.length) continue;
      if (grid[nxtRow][nxtCol] === tile.wall) continue;
      if (closeList.has(`${nxtRow},${nxtCol}`)) continue;
      MinHeap.push(openList, [gCost+1, nxtRow, nxtCol]);
      ani.push([nxtRow, nxtCol]);
      path[`${nxtRow},${nxtCol}`] = `${currRow},${currCol}`;
    }
  }
  return [ani, path];
}