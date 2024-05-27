let board = document.querySelector(".gameboard");
let numGrid = 7;
let gridSize = board.getClientRects()[0].width / numGrid;
let html = document.querySelector("html").style.setProperty("--grid-size", `${gridSize}px`);
let game = new ConnectFour(board, numGrid, gridSize);
let agent = new MinimaxAgent();
agent.maxDepth = 6;

board.addEventListener("click", async event => {
  await game.move(event.target.getAttribute("col"));

  if (game.turn === 2 && !game.isWin) {
    let temp = agent.copyBoard(game.board);
    agent.bestMove = null;
    agent.minimax(temp, 6, true);
    await game.move(agent.bestMove);
  }

})
