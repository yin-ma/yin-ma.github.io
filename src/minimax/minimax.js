let board = document.querySelector(".gameboard");
let numGrid = 7;
let gridSize = board.getClientRects()[0].width / numGrid;
let html = document.querySelector("html").style.setProperty("--grid-size", `${gridSize}px`);
let game = new ConnectFour(board, numGrid, gridSize);

// let temp = document.createElement("div");
// temp.classList.add("piece");
// temp.classList.add("opponent");
// board.appendChild(temp);

board.addEventListener("click", async event => {
  await game.move(event.target.getAttribute("col"));
})

