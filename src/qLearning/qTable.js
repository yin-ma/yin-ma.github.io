export class QTable {
  constructor(nRow, nCol, nAction) {
    this.table = new Array(nRow).fill(0).map(r => new Array(nCol).fill(0).map(c => new Array(nAction).fill(0)))
    this.nRow = nRow
    this.nCol = nCol
    this.nAction = nAction
  }

  get(row, col, action) {
    return this.table[row][col][action]
  }

  set (row, col, action, value) {
    this.table[row][col][action] = value
  }

  maxAction(row, col) {
    let action = 0;
    let currQ = this.table[row][col][0]
    let isAllZero = true
    for (let i=0; i<this.nAction; i++) {
      if (currQ < this.table[row][col][i]) {
        action = i
        currQ = this.table[row][col][i]
      }
      if (this.table[row][col][i] !== 0) {
        isAllZero = false
      }
    }

    if (isAllZero) {
      action = this.randInt(0, this.nAction-1)
    }
    return [action, currQ];
  }

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}