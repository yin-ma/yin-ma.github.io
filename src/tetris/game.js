import { IBlock, LBlock, OBlock, RBlock, SBlock, TBlock, ZBlock } from "./block.js";
import config from "./config.js";


export class Game {
  constructor(boardElement) {
    this.boardElement = boardElement;
    this.grids = Array(config.numRows).fill(null).map(r => Array(config.numCols).fill(null));
    this.id = 0;
    this.currentBlock = null;
    this.speed = 200;
    this.init();
  }

  init() {
    this.boardElement.style.setProperty('--grid-size', `${config.gridSize}vmin`);
    this.boardElement.style.setProperty('--num-rows', config.numRows);
    this.boardElement.style.setProperty('--num-cols', config.numCols);
    
    for (let i=0; i<config.numRows; i++) {
      for(let j=0; j<config.numCols; j++) {
        let div = document.createElement('div');
        div.classList.add('grid');
        this.boardElement.appendChild(div);
      }
    }
  }

  run() {
    setInterval(() => {
      this.update();
    }, this.speed);
  }

  update() {
    if (this.currentBlock) {
      if (this.canMoveDown()) {
        this.moveBlockDown();
      } else {
        this.currentBlock.setMovable(false);
        this.currentBlock = null;
      }
    } else {
      this.clearLine();
      if (!this.spawnBlock()) {
        let dialogElement = document.querySelector('.dialog');
        dialogElement.style.display = 'block';
      };
    }
  }

  restart() {
    for (let i=0; i<config.numRows; i++) {
      for (let j=0; j<config.numCols; j++) {
        if (this.grids[i][j] !== null) {
          this.grids[i][j].remove();
        }
      }
    }

    this.grids = Array(config.numRows).fill(null).map(r => Array(config.numCols).fill(null));
    this.currentBlock = null;

    let dialogElement = document.querySelector('.dialog');
    dialogElement.style.display = 'none';
  }

  clearLine() {
    let offset = 0;
    for (let i=config.numRows-1; i>=0; i--) {
      let isFull = !this.grids[i].some(c => c === null)

      if (isFull) {
        offset += 1;
        this.grids[i].forEach((c, j) => this.removeCell(i, j));        
      } else {
        if (offset !== 0) {
          this.grids[i].forEach((c, j) => {
            if (c !== null) {
              this.grids[i][j].setPosition(i+offset, j);
              this.grids[i+offset][j] = this.grids[i][j];
              this.grids[i][j] = null;
            }
          })
        }
      }
    }
  }

  canRotateBlock() {
    this.currentBlock.rotate();
    let canRotate = this.validBlock(this.currentBlock);
    this.currentBlock.invRotate();
    return canRotate;
  }

  rotateBlock() {
    if (this.currentBlock === null) return;
    if (!this.canRotateBlock()) return;
    if (this.currentBlock.type !== 'oblock') {
      this.currentBlock.cells.forEach(c => {
        this.grids[c.i][c.j] = null;
      })
      this.currentBlock.rotate();
      this.currentBlock.cells.forEach(c => {
        this.grids[c.i][c.j] = c;
      })
    }
  }

  moveBlockDown() {
    if (this.currentBlock === null) return;
    this.currentBlock.moveDown();
    if (!this.validBlock(this.currentBlock)) {
      this.currentBlock.moveUp();
      return;
    }

    this.currentBlock.moveUp();
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = null;
    })
    this.currentBlock.moveDown();
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = c;
    })
  }

  moveBlockLeft() {
    if (this.currentBlock === null) return;
    this.currentBlock.moveLeft();
    if (!this.validBlock(this.currentBlock)) {
      this.currentBlock.moveRight();
      return;
    }

    this.currentBlock.moveRight();
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = null;
    })
    this.currentBlock.moveLeft();
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = c;
    })
  }

  moveBlockRight() {
    if (this.currentBlock === null) return;
    this.currentBlock.moveRight();
    if (!this.validBlock(this.currentBlock)) {
      this.currentBlock.moveLeft();
      return;
    }

    this.currentBlock.moveLeft();
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = null;
    })
    this.currentBlock.moveRight();
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = c;
    })
  }

  addBlock(block) {
    block.cells.forEach(c => {
      this.addCell(c);
    })
  }

  addCell(cell) {
    this.grids[cell.i][cell.j] = cell;
    this.boardElement.appendChild(cell.htmlElement);
  }

  spawnBlock() {
    const blocks = [IBlock, LBlock, OBlock, SBlock, TBlock, ZBlock, RBlock];
    this.currentBlock = new blocks[Math.floor(Math.random() * 7)]();
    
    if (!this.validBlock(this.currentBlock)) {
      this.currentBlock = null;
      return false;
    }
    
    this.addBlock(this.currentBlock);
    this.currentBlock.setID(this.id);
    this.id += 1;
    return true;
  }

  removeCell(i, j) {
    if (this.grids[i][j]) {
      this.grids[i][j].remove();
      this.grids[i][j] = null;
    }
  }

  validBlock(block) {
    // if block is out of gameboard || collide with other block => invalid move
    return !block.cells.some(c => {
      if (c.i < 0 || c.i >= config.numRows || c.j < 0 || c.j >= config.numCols) return true;
      if (this.grids[c.i][c.j] !== null && this.grids[c.i][c.j].id !== c.id) return true;
      return false;
    })
  }

  canMoveDown() {
    if (this.currentBlock === null) return;
    // if cell is last row || its bottom side has other block => cannot move downward
    return !this.currentBlock.cells.some(c => {
      if (c.i === config.numRows - 1) return true;
      else if (this.grids[c.i+1][c.j] !== null && this.grids[c.i+1][c.j].id !== c.id) return true;
      return false;
    })
  }
}