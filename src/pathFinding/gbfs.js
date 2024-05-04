import { MinHeap } from "./libs/priorityQueue.js";


export async function gbfs(startRow, startCol, endRow, endCol, grid, tile) {
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
      if (nxtRow < 0 || nxtRow >= grid.length || nxtCol < 0 || nxtCol >= grid.length) continue;
      if (grid[nxtRow][nxtCol] === tile.wall) continue;
      MinHeap.push(openList, [heuristic(nxtRow, nxtCol, endRow, endCol), nxtRow, nxtCol]);
      ani.push([nxtRow, nxtCol])
      if ((`${nxtRow},${nxtCol}` in closeList) && closeList[`${nxtRow},${nxtCol}`] >= heuristic(nxtRow, nxtCol, endRow, endCol)) continue;
      path[`${nxtRow},${nxtCol}`] = `${currRow},${currCol}`;
    }
  }
  return [ani, path];
}