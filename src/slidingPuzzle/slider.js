class Slider{
  constructor(canvas, row, col) {
    this.canvas = canvas;
    this.numRow = row;
    this.numCol = col;
    this.grid = [];
    this.gridElement = [];
    this.emptyTileRow = row-1;
    this.emptyTileCol = col-1;
    this.isMoving = false;
    this.history = [];
    this.recording = true;
    this.aniSpeed = 300;
    this.init();
  }

  init() {
    this.canvas.innerHTML = "";
    this.grid = [];
    this.gridElement = [];
    this.history = [];
    this.emptyTileRow = this.numRow-1;
    this.emptyTileCol = this.numCol-1;
    let canvasWidth = this.canvas.getBoundingClientRect().width;
    let canvasHeight = this.canvas.getBoundingClientRect().height;
    for (let i=0; i<this.numRow; i++) {
      let tempRow = [];
      for (let j=0; j<this.numCol; j++) {
        let tempTile = document.createElement("div");
        tempTile.style.width = `${canvasWidth / this.numCol}px`;
        tempTile.style.height = `${canvasHeight / this.numRow}px`;
        if (i === this.numRow-1 && j === this.numCol-1) {
          tempTile.classList.add("empty");
        } else {
          tempTile.classList.add("tile");
          tempTile.innerHTML = `${i*this.numCol + j}`;
          tempTile.style.backgroundPosition = `${-j*canvasWidth / this.numCol}px ${-i*canvasWidth / this.numCol}px`;
        }
        tempTile.setAttribute("row", i);
        tempTile.setAttribute("col", j);
        this.canvas.appendChild(tempTile);
        tempRow.push(tempTile);
      }
      this.gridElement.push(tempRow);
    }
    
    for (let i=0; i<this.numRow; i++) {
      let tempRow = [];
      for (let j=0; j<this.numCol; j++) {
        tempRow.push(i*this.numCol+j);
      }
      this.grid.push(tempRow);
    }
    
  }

  draw() {
    for (let i=0; i<this.numRow; i++) {
      for (let j=0; j<this.numCol; j++) {
        if (this.grid[i][j] !== this.numRow*this.numCol-1) {
          let canvasWidth = this.canvas.getBoundingClientRect().width;
          let canvasHeight = this.canvas.getBoundingClientRect().height;
          let gridSize = canvasWidth / this.numCol;
          this.gridElement[i][j].innerHTML = this.grid[i][j];
          this.gridElement[i][j].style.backgroundPosition = `${-this.grid[i][j]%this.numCol*gridSize}px ${-Math.floor(this.grid[i][j]/this.numRow)*(gridSize)}px`;
        } else {
          this.gridElement[i][j].innerHTML = "";
        }
      }
    }
  }

  async move(dir, showAni=true) {
    if (!this.isMoveAvailable(dir)) return;
    if (this.isMoving) return;
    this.isMoving = true;
    let dr = 0;
    let dc = 0;
    switch (dir) {
      case "R":
        dc = 1;
        break;
      case "L":
        dc = -1;
        break
      case "U":
        dr = -1;
        break
      case "D":
        dr = 1;
        break
      default:
        break;
      }
    if(this.recording) {
      this.history.push(dir);
    }
    if (showAni) {
      await this.animateMove(dr, dc);
    }

    // swap content
    let temp = this.grid[this.emptyTileRow+dr][this.emptyTileCol+dc];
    this.grid[this.emptyTileRow+dr][this.emptyTileCol+dc] = this.grid[this.emptyTileRow][this.emptyTileCol];
    this.grid[this.emptyTileRow][this.emptyTileCol] = temp;

    // swap html element
    this.gridElement[this.emptyTileRow+dr][this.emptyTileCol+dc].classList.remove("tile");
    this.gridElement[this.emptyTileRow+dr][this.emptyTileCol+dc].classList.add("empty");
    this.gridElement[this.emptyTileRow][this.emptyTileCol].classList.remove("empty");
    this.gridElement[this.emptyTileRow][this.emptyTileCol].classList.add("tile");
    this.gridElement[this.emptyTileRow+dr][this.emptyTileCol+dc].style.animation = "";
    this.emptyTileRow += dr;
    this.emptyTileCol += dc;
    this.isMoving = false;
  }

  async animateMove(dr, dc) {
    if (dc === -1) {
      this.gridElement[this.emptyTileRow+dr][this.emptyTileCol+dc].style.animation = `move-right ${this.aniSpeed}ms forwards`;
    }
    else if (dc === 1) {
      this.gridElement[this.emptyTileRow+dr][this.emptyTileCol+dc].style.animation = `move-left ${this.aniSpeed}ms forwards`;
    }
    else if (dr === 1) {
      this.gridElement[this.emptyTileRow+dr][this.emptyTileCol+dc].style.animation = `move-up ${this.aniSpeed}ms forwards`;
    }
    else if (dr === -1) {
      this.gridElement[this.emptyTileRow+dr][this.emptyTileCol+dc].style.animation = `move-down ${this.aniSpeed}ms forwards`;
    }
    await new Promise(resolve => setTimeout(resolve, this.aniSpeed));
  }

  isMoveAvailable(dir) {
    let newRow = this.emptyTileRow;
    let newCol = this.emptyTileCol;
    if (dir === "R") {
      newCol += 1;
    }
    else if (dir === "U") {
      newRow -= 1;
    }
    else if (dir === "L") {
      newCol -= 1;
    }
    else if (dir === "D") {
      newRow += 1;
    }

    if (newRow < 0 || newRow >= this.numRow || newCol < 0 || newCol >= this.numCol) {
      return false;
    }
    return true;
  }

  isWin() {
    for (let i=0; i<this.numRow; i++) {
      for (let j=0; j<this.numCol; j++) {
        if (this.grid[i][j] !== i*this.numCol + j) return false;
      }
    }
    return true;
  }

  async shuffle() {
    let avaMove = ["R", "L", "U", "D"];
    let count = 50;
    while (count > 0) {
      await this.move(avaMove[(Math.floor(Math.random()*4))], false);
      this.draw();
      count -= 1;
    }
  }

  async solve() {
    this.recording = false;
    while (this.history.length > 0) {
      let move = this.history.pop();
      let solveMove = "";
      switch (move) {
        case "R":
          solveMove = "L";
          break;
        case "L":
          solveMove = "R";
          break;
        case "U":
          solveMove = "D";
          break;
          case "D":
            solveMove = "U";
            break;
        default:
          break;
      }
      this.aniSpeed = 100;
      await this.move(solveMove);
      this.aniSpeed = 300;
      this.draw();
    }
    this.recording = true;
  }
}