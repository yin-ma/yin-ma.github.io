let board = document.querySelector(".gameboard");
let numGrid = 7;
let gridSize = 70;

for (let r=0; r<numGrid; r++) {
  for (let c=0; c<numGrid; c++) {
    let div = document.createElement("div");
    let tempClass = (r === 0) ? "grid-first-row" : "grid";
    div.classList.add(tempClass);
    div.setAttribute("row", r);
    div.setAttribute("col", c);
    div.style.position = "absolute";
    div.style.left = `${gridSize*c}px`;
    div.style.top = `${gridSize*r}px`;
    board.appendChild(div);
  }
}

let temp = document.createElement("div");
temp.classList.add("piece");
temp.classList.add("opponent");
board.appendChild(temp);