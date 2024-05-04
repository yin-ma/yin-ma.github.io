import { MinHeap } from "./libs/priorityQueue.js";


export async function astar(startRow, startCol, endRow, endCol, grid, tile) {
  function heuristic(pr1, pc1, pr2, pc2) {
    return Math.abs(pr2-pr1) + Math.abs(pc2-pc1);
  }
  let openList = [[heuristic(startRow, startCol, endRow, endCol), 0, heuristic(startRow, startCol, endRow, endCol), startRow, startCol, startRow, startCol]];
  let closeList = {};
  let ani = [];
  let path = {};

  while (openList.length > 0) {
    let [fCost, gCost, hCost, currRow, currCol, prevRow, prevCol] = MinHeap.pop(openList);
    
    if (`${currRow},${currCol}` in closeList && closeList[`${currRow},${currCol}`] <= gCost) continue;
    closeList[`${currRow},${currCol}`] = gCost;
    path[`${currRow},${currCol}`] = `${prevRow},${prevCol}`;
    
    if (currRow === endRow && currCol === endCol) break;
    
    let direction = [[0, -1], [-1, 0], [1, 0], [0, 1]];
    for (let [dr, dc] of direction) {
      let nxtRow = currRow + dr;
      let nxtCol = currCol + dc;
      if (nxtRow < 0 || nxtRow >= grid.length || nxtCol < 0 || nxtCol >= grid.length) continue;
      if (grid[nxtRow][nxtCol] === tile.wall) continue;
      if (`${nxtRow},${nxtCol}` in closeList) continue;
      
      MinHeap.push(openList, [gCost+heuristic(nxtRow, nxtCol, endRow, endCol)+1, gCost+1, heuristic(nxtRow, nxtCol, endRow, endCol), nxtRow, nxtCol, currRow, currCol]);
      ani.push([nxtRow, nxtCol])
    }
  }
  return [ani, path];
}