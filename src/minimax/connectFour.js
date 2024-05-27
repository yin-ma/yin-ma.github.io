class ConnectFour {
  constructor(boardElement, numGrid, gridSize) {
    this.boardElement = boardElement;
    this.board = [];
    this.numGrid = numGrid;
    this.gridSize = gridSize;
    this.isMoving = false;
    this.isWin = false;
    this.turn = 1;
    this.firstRowElement = [];
    this.initBoardhtml();
    this.initBoard();
  }

  reset() {
    this.isMoving = false;
    this.isWin = false;
    this.turn = 1;
    this.initBoard();
    this.initBoardhtml();
  }

  initBoardhtml() {
    this.boardElement.innerHTML = "";
    this.firstRowElement = [];
    for (let r=0; r<this.numGrid; r++) {
      for (let c=0; c<this.numGrid; c++) {
        let div = document.createElement("div");
        if (r === 0) {
          div.classList.add("grid-first-row");
          div.classList.add("player");
          this.firstRowElement.push(div);
        }
        else {
          div.classList.add("grid");
        }
        div.setAttribute("row", r);
        div.setAttribute("col", c);
        div.style.position = "absolute";
        div.style.left = `${gridSize*c}px`;
        div.style.top = `${gridSize*r}px`;
        this.boardElement.appendChild(div);
      }
    }
  }

  initBoard() {
    this.board = [];  
    for (let r=0; r<this.numGrid-1; r++) {
      let tempRow = [];
      for (let c=0; c<this.numGrid; c++) {
        tempRow.push(0);
      }
      this.board.push(tempRow);
    }
  }

  async move(c) {
    if (this.isMoving || this.isWin) return;
    for (let r=this.board.length-1; r>=0; r--) {
      if (this.isGridEmpty(r, c)) {
        this.isMoving = true;
        this.board[r][c] = this.turn;
        await this.animateMove(r, c);
        this.isMoving = false;
        break;
      }
    }

    if (this.boardIsFull()) {
      this.displayText("draw");
      this.clickToRestart();
    };

    if (this.checkisWin()) {
      if (this.turn === 1) {
        this.displayText("opponent win!");
        this.clickToRestart();

      } else {
        this.displayText("you win!");
        this.clickToRestart();
      }
    }
  }

  clickToRestart() {
    this.boardElement.addEventListener("click", event => {
      this.reset();
    }, { once: true })
  }

  async animateMove(r, c) {
    let div = document.createElement("div");
    let turn = (this.turn === 1) ? "player" : "opponent";
    this.firstRowElement.forEach(e => {
      if (this.turn === 1) {
        e.classList.remove("player");
        e.classList.add("opponent");
      } else {
        e.classList.remove("opponent");
        e.classList.add("player");
      }
    })
    this.turn = (this.turn === 1) ? 2 : 1;
    div.style.left = `${c*this.gridSize}px`;
    div.classList.add("piece");
    div.classList.add(turn);
    this.boardElement.appendChild(div);
    await new Promise(resolve => setTimeout(resolve, 1));
    div.style.transform = `translateY(${(r+1)*this.gridSize}px)`;
    await new Promise(resolve => setTimeout(resolve, 400));
  }

  isGridEmpty(r, c) {
    if (this.board[r][c] === 0) return true;
    return false;
  }

  boardIsFull() {
    for (let r=0; r<this.numGrid-1; r++) {
      for (let c=0; c<this.numGrid; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }
      }
    }
    this.isWin = true;
    return true;
  }

  checkisWin() {
    // check verticle "|"
    for (let col=0; col<this.numGrid; col ++) {
      for (let row=0; row<this.numGrid-1-3; row++) {
        if (this.board[row][col] === 0) continue;
        if (
          this.board[row][col] === this.board[row+1][col] &&
          this.board[row][col] === this.board[row+2][col] &&
          this.board[row][col] === this.board[row+3][col]
        ) {
          this.isWin = true;
          return true;
        }
      }
    }

    // check horizontal "-"
    for (let row=0; row<this.numGrid-1; row++) {
      for (let col=0; col<this.numGrid-3; col++) {
        if (this.board[row][col] === 0) continue;
        if (
          this.board[row][col] === this.board[row][col+1] &&
          this.board[row][col] === this.board[row][col+2] &&
          this.board[row][col] === this.board[row][col+3]
        ) {
          this.isWin = true;
          return true;
        }
      }
    }

    // check diagonal "/"
    for (let row=3; row<this.numGrid-1; row++) {
      for (let col=0; col<this.numGrid-3; col++) {
        if (this.board[row][col] === 0) continue;
        if (
          this.board[row][col] === this.board[row-1][col+1] && 
          this.board[row][col] === this.board[row-2][col+2] && 
          this.board[row][col] === this.board[row-3][col+3]
        ) {
          this.isWin = true;
          return true;
        }
      }
    }
    
    // check diagonal "\"
    for (let row=0; row<this.numGrid-1-3; row++) {
      for (let col=0; col<this.numGrid-3; col++) {
        if (this.board[row][col] === 0) continue;
        if (
          this.board[row][col] === this.board[row+1][col+1] && 
          this.board[row][col] === this.board[row+2][col+2] && 
          this.board[row][col] === this.board[row+3][col+3]
        ) {
          this.isWin = true;
          return true;
        }
      }
    }

    return false;
  }

  displayText(t) {
    let text = document.createElement("div");
    text.innerHTML = t;
    text.classList.add("game-text");
    this.boardElement.appendChild(text);
  }

  getAvailableMove() {
    let res = [];
    for (let col=0; col<this.numGrid; col++) {
      if (this.board[0][col] === 0) {
        res.push(true);
      } else{
        res.push(false);
      }
    }
    return res;
  }

}

