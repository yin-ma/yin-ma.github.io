import { Game } from "./game.js";

let boardElement = document.querySelector('#board');

let game = new Game(boardElement);
game.run();

document.addEventListener('keydown', event => {
  if (event.key === 'w') {
    game.rotateBlock();
  } else if (event.key === 'a') {
    game.moveBlockLeft();
  } else if (event.key === 'd') {
    game.moveBlockRight();
  } else if (event.key === 's') {
    game.moveBlockDown();
  } else if (event.key === 'r') {
    game.restart();
  }
})