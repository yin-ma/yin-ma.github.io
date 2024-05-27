class MinimaxAgent {
  constructor() {
    this.bestMove = null;
    this.maxDepth = 4;
  }

  minimax(node, depth, maximizingPlayer) {
    if (this.isTerminal(node)) {
      if (maximizingPlayer) {
        return -1000000;
      } else{
        return 1000;
      }
    } else if (depth === 0) {
      return this.heurisic(node, maximizingPlayer);
    }

    if (maximizingPlayer) {
      let value = -10000000;
      for (let c=0; c<node[0].length; c++) {
        if (!this.isMoveValid(node, c)) continue;
        let temp = this.copyBoard(node);
        this.move(temp, c, 2);
        let newV = this.minimax(temp, depth-1, false);
        if (newV > value) {
          value = newV;
          if (depth === this.maxDepth) {
            this.bestMove = c;
          }
        }
      }
      return value;
    }

    else {
      let value = 10000000;
      for (let c=0; c<node[0].length; c++) {
        if (!this.isMoveValid(node, c)) continue;
        let temp = this.copyBoard(node);
        this.move(temp, c, 1);
        value = Math.min(value, this.minimax(temp, depth-1, true));
      }
      return value;
    }
  }

  copyBoard(board) {
    let res = [];
    for (let r=0; r<board.length; r++) {
      res.push([...board[r]]);
    }
    return res;
  }

  countConnectFour(state, player)  {
    let count = 0;
    let numGrid = state[0].length;
    let opponent = (player === 1) ? 2 : 1;

    // check verticle "|"
    for (let col=0; col<numGrid; col ++) {
      for (let row=0; row<numGrid-1-3; row++) {
        if (state[row][col] === opponent) continue;
        if (
          (state[row+1][col] === opponent) ||
          (state[row+2][col] === opponent) ||
          (state[row+3][col] === opponent)
        ) {
          continue;
        }
        count += 1;
      }
    }

    // check horizontal "-"
    for (let row=0; row<numGrid-1; row++) {
      for (let col=0; col<numGrid-3; col++) {
        if (state[row][col] === opponent) continue;
        if (
          (state[row][col+1] === opponent) ||
          (state[row][col+2] === opponent) ||
          (state[row][col+3] === opponent)
        ) {
          continue;
        }        
        count += 1;
      }
    }    

    // check diagonal "/"
    for (let row=3; row<numGrid-1; row++) {
      for (let col=0; col<numGrid-3; col++) {
        if (state[row][col] === opponent) continue;
        if (
          (state[row-1][col+1] === opponent) ||
          (state[row-2][col+2] === opponent) ||
          (state[row-3][col+3] === opponent)
        ) {
          continue;
        }        
        count += 1;
      }
    }        

    // check diagonal "\"
    for (let row=0; row<numGrid-1-3; row++) {
      for (let col=0; col<numGrid-3; col++) {
        if (state[row][col] === opponent) continue;
        if (
          (state[row+1][col+1] === opponent) ||
          (state[row+2][col+2] === opponent) ||
          (state[row+3][col+3] === opponent)
        ) {
          continue;
        }        
        count += 1;
      }
    }

    return count;
  }

  heurisic(state, maximizingPlayer) {
    // count how many connect four left
    let countYellow = this.countConnectFour(state, 2);
    let countRed = this.countConnectFour(state, 1);

    if (maximizingPlayer) return (countYellow-countRed);
    return -(countYellow-countRed);
  }

  isTerminal(state) {
    let numGrid = state[0].length;

    // check if board is full
    if (this.boardIsFull(state)) return true;

    // check verticle "|"
    for (let col=0; col<numGrid; col ++) {
      for (let row=0; row<numGrid-1-3; row++) {
        if (state[row][col] === 0) continue;
        if (
          state[row][col] === state[row+1][col] &&
          state[row][col] === state[row+2][col] &&
          state[row][col] === state[row+3][col]
        ) {
          return true;
        }
      }
    }

    // check horizontal "-"
    for (let row=0; row<numGrid-1; row++) {
      for (let col=0; col<numGrid-3; col++) {
        if (state[row][col] === 0) continue;
        if (
          state[row][col] === state[row][col+1] &&
          state[row][col] === state[row][col+2] &&
          state[row][col] === state[row][col+3]
        ) {
          return true;
        }
      }
    }

    // check diagonal "/"
    for (let row=3; row<numGrid-1; row++) {
      for (let col=0; col<numGrid-3; col++) {
        if (state[row][col] === 0) continue;
        if (
          state[row][col] === state[row-1][col+1] && 
          state[row][col] === state[row-2][col+2] && 
          state[row][col] === state[row-3][col+3]
        ) {
          return true;
        }
      }
    }
    
    // check diagonal "\"
    for (let row=0; row<numGrid-1-3; row++) {
      for (let col=0; col<numGrid-3; col++) {
        if (state[row][col] === 0) continue;
        if (
          state[row][col] === state[row+1][col+1] && 
          state[row][col] === state[row+2][col+2] && 
          state[row][col] === state[row+3][col+3]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  boardIsFull(state) {
    let numGrid = state.length;
    for (let r=0; r<numGrid-1; r++) {
      for (let c=0; c<numGrid; c++) {
        if (state[r][c] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  move(board, c, turn) {
    let numGrid = board.length;
    for (let r=numGrid-1; r>=0; r--) {
      if (board[r][c] === 0) {
        board[r][c] = turn;
        break;
      }
    }
  }

  isMoveValid(board, c) {
    if (board[0][c] !== 0) return false;
    return true;
  }
}