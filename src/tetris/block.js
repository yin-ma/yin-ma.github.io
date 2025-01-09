import { Cell } from "./cell.js";
import config from "./config.js";


// TBlock, OBlock, LBlock, ZBlock, IBlock, SBlock, RBlock

class Block {
  constructor() {
    this.cells = [];
    this.color = {x: 255, y: 255, z: 255};
    this.origin = {i: 0, j: 0}
    this.type = 'block';
  }

  isMovable() {
    let result = true;
    this.cells.forEach(c => {
      if (!c.movable) {
        result = false;
      }
    })
    return result;
  }

  invRotate() {
    this.cells.forEach(c => {
      let i = c.i - this.origin.i;
      let j = c.j - this.origin.j;

      c.setPosition(-j+this.origin.i, i+this.origin.j);
    })    
  }

  rotate() {
    this.cells.forEach(c => {
      let i = c.i - this.origin.i;
      let j = c.j - this.origin.j;

      c.setPosition(j+this.origin.i, -i+this.origin.j);
    })
  }

  moveDown() {
    this.cells.forEach(c => {
      c.moveDown();
    })
    this.origin.i += 1;
  }

  moveLeft() {
    this.cells.forEach(c => {
      c.moveLeft();
    })
    this.origin.j -= 1;
  }

  moveRight() {
    this.cells.forEach(c => {
      c.moveRight();
    })
    this.origin.j += 1;
  }

  setMovable(bool) {
    this.cells.forEach(c => {
      c.movable = bool;
    })
  }

  setID(id) {
    this.cells.forEach(c => {
      c.id = id;
    })
  }
}


export class TBlock extends Block {
  constructor() {
    super();
    this.cells = [];
    this.color = {x: 255, y: 255, z: 0};
    this.type = 'tblock';
    this.init();
  }

  init() {
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) - 2, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) , this.color));

    this.origin = {i: 1, j: Math.floor(config.numCols/2) - 1};
  }
}


export class OBlock extends Block {
  constructor() {
    super();
    this.cells = [];
    this.color = {x: 255, y: 0, z: 0};
    this.type = 'oblock';
    this.init();
  }

  init() {
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(0, Math.floor(config.numCols/2), this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2), this.color));
  }
}


export class RBlock extends Block {
  constructor() {
    super();
    this.cells = [];
    this.color = {x: 0, y: 0, z: 255};
    this.type = 'rblock';
    this.init();
  }

  init() {
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) - 2, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) - 2, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2), this.color));

    this.origin = {i: 1, j: Math.floor(config.numCols/2) - 1};
  }
}


export class ZBlock extends Block {
  constructor() {
    super();
    this.cells = [];
    this.color = {x: 255, y: 0, z: 255};
    this.type = 'zblock';
    this.init();
  }

  init() {
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(0, Math.floor(config.numCols/2), this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2), this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) + 1, this.color));

    this.origin = {i: 0, j: Math.floor(config.numCols/2)};
  }
}


export class IBlock extends Block {
  constructor() {
    super();
    this.cells = [];
    this.color = {x: 0, y: 255, z: 0};
    this.type = 'iblock';
    this.init();
  }

  init() {
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) - 2, this.color));
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(0, Math.floor(config.numCols/2), this.color));
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) + 1 , this.color));

    this.origin = {i: 0, j: Math.floor(config.numCols/2) - 1};
  }
}


export class SBlock extends Block {
  constructor() {
    super();
    this.cells = [];
    this.color = {x: 0, y: 255, z: 255};
    this.type = 'sblock';
    this.init();
  }

  init() {
    this.cells.push(new Cell(0, Math.floor(config.numCols/2), this.color));
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) + 1, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2), this.color));

    this.origin = {i: 0, j: Math.floor(config.numCols/2)};
  }
}


export class LBlock extends Block {
  constructor() {
    super();
    this.cells = [];
    this.color = {x: 255, y: 127, z: 0};
    this.type = 'lblock';
    this.init();
  }

  init() {
    this.cells.push(new Cell(0, Math.floor(config.numCols/2) + 1, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) - 1, this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2), this.color));
    this.cells.push(new Cell(1, Math.floor(config.numCols/2) + 1, this.color));

    this.origin = {i: 0, j: Math.floor(config.numCols/2)};
  }
}