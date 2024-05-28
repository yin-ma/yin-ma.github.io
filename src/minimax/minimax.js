let board = document.querySelector(".gameboard");
let numGrid = 7;
let maxDepth = 6;
let gridSize = board.getClientRects()[0].width / numGrid;
let html = document.querySelector("html").style.setProperty("--grid-size", `${gridSize}px`);
let game = new ConnectFour(board, numGrid, gridSize);
let agent = new MinimaxAgent(2, maxDepth);

board.addEventListener("click", async event => {
  if (game.turn === 1 && !game.isWin) {
    await game.move(event.target.getAttribute("col"));
  }

  if (game.turn === 2 && !game.isWin) {
    let temp = agent.copyBoard(game.board);
    agent.setPlayer(2);
    await game.move(agent.getBestMove(temp));
  }

})
