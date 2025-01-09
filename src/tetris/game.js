import { IBlock, LBlock, OBlock, RBlock, SBlock, TBlock, ZBlock } from "./block.js";
import { Cell } from "./cell.js";
import config from "./config.js";


export class Game {
  constructor(boardElement) {
    this.boardElement = boardElement;
    this.grids = Array(config.numRows).fill(null).map(r => Array(config.numCols).fill(null));
    this.id = 0;
    this.currentBlock = null;
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
    }, 200);
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
      let isFull = true;
      for (let j=0; j<config.numCols; j++) {
        if (this.grids[i][j] === null) {
          isFull = false;
        }
      }

      if (isFull) {
        offset += 1;
        for (let j=0; j<config.numCols; j++) {
          this.removeCell(i, j);
        }
      } else {
        if (offset !== 0) {
          for (let j=0; j<config.numCols; j++) {
            if (this.grids[i][j] !== null) {
              this.grids[i][j].setPosition(i+offset, j);
              this.grids[i+offset][j] = this.grids[i][j];
              this.grids[i][j] = null;
            }
          }
        }
      }
    }
  }

  canRotateBlock() {
    this.currentBlock.rotate();
    let canRotate = true;
    this.currentBlock.cells.forEach(c => {
      if (this.grids[c.i][c.j] !== null && this.grids[c.i][c.j].id !== c.id) {
        canRotate = false;
      }
    })
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
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = null;
    })

    this.currentBlock.moveDown();

    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = c;
    })
    
  }

  moveBlockLeft() {
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = null;
    })

    this.currentBlock.moveLeft();

    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = c;
    })
    
  }

  moveBlockRight() {
    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = null;
    })

    this.currentBlock.moveRight();

    this.currentBlock.cells.forEach(c => {
      this.grids[c.i][c.j] = c;
    })
    
  }

  addNewCell(i, j, color) {
    let cell = new Cell(i, j, color);
    this.addCell(cell);
    cell.id = this.id;
    this.id += 1;
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
    //  IBlock, LBlock, OBlock, SBlock, TBlock, ZBlock, RBlock

    let rand = Math.floor(Math.random() * 7);
    let block;
    switch (rand) {
      case 0:
        block = new IBlock();
        break;
      case 1:
        block = new LBlock();
        break;
      case 2:
        block = new OBlock();
        break;
      case 3:
        block = new SBlock();
        break;
      case 4:
        block = new TBlock();
        break;
      case 5:
        block = new ZBlock();
        break;
      case 6:
        block = new RBlock();
      default:
        break;
    }

    this.currentBlock = block;
    
    if (!this.canSpawnBlock()) {
      this.currentBlock = null;
      return false;
    };
    
    this.addBlock(block);
    block.setID(this.id);
    this.id += 1;
    return true;
  }

  canSpawnBlock() {
    let canSpawn = true;
    this.currentBlock.cells.forEach(c => {
      if (this.grids[c.i][c.j] !== null) {
        canSpawn = false;
      }
    })
    return canSpawn;
  }

  removeCell(i, j) {
    if (this.grids[i][j]) {
      this.grids[i][j].remove();
      this.grids[i][j] = null;
    }
  }

  canMoveDown() {
    if (this.currentBlock === null) return;
    let canMoveDown = true;
    this.currentBlock.cells.forEach(c => {
      if (c.i === config.numRows-1) {
        canMoveDown = false;
      }
      else if (this.grids[c.i+1][c.j] !== null && this.grids[c.i+1][c.j].id !== c.id) {
        canMoveDown = false;
      }
    })

    if (!canMoveDown) {
      this.currentBlock.setMovable(false);
    }
    return canMoveDown;
  }

  canMoveLeft() {
    if (this.currentBlock === null) return;
    let canMoveLeft = true;
    this.currentBlock.cells.forEach(c => {
      if (c.j === 0) {
        canMoveLeft = false;
      }
      else if (this.grids[c.i][c.j-1] !== null && this.grids[c.i][c.j-1].id !== c.id) {
        canMoveLeft = false;
      }
    })

    return canMoveLeft;
  }

  canMoveRight() {
    if (this.currentBlock === null) return;
    let canMoveRight= true;
    this.currentBlock.cells.forEach(c => {
      if (c.j === config.numCols-1) {
        canMoveRight = false;
      }
      else if (this.grids[c.i][c.j+1] !== null && this.grids[c.i][c.j+1].id !== c.id) {
        canMoveRight = false;
      }
    })

    return canMoveRight;
  }
}