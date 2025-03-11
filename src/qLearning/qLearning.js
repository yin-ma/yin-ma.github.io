import { QTable } from "./qTable.js"

let nRow = 8
let nCol = 12

const action = {UP: 0, RIGHT:1, DOWN: 2, LEFT: 3}
const gridType = {SPACE:0, START: 1, END:2, WALL: 3}

let epsilon = 1.00
let epsilonDecay = 0.999
let epsilonMin = 0.05
let gamma = 0.999
let alpha = 0.1
let maxStep = 200
let epoch = 50


let grid = document.querySelector(".grid")

let qtable = new QTable(nRow, nCol, 4)
let gridTextElemet = new Array(nRow).fill(0).map(r => new Array(nCol).fill(0).map(c => new Array(4).fill(0)))
let gridElemet = new Array(nRow).fill(0).map(r => new Array(nCol).fill(0))
let girdMap = new Array(nRow).fill(0).map(r => new Array(nCol).fill(0))
girdMap[5][9] = gridType.END
girdMap[2][7] = gridType.WALL
girdMap[3][6] = gridType.WALL
girdMap[4][5] = gridType.WALL
girdMap[5][4] = gridType.WALL
girdMap[5][3] = gridType.WALL
girdMap[2][8] = gridType.WALL
girdMap[2][9] = gridType.WALL
girdMap[2][10] = gridType.WALL
girdMap[5][2] = gridType.WALL
girdMap[5][1] = gridType.WALL


let currPosition = {row: 2, col: 2}

let trainBtn = document.querySelector(".train")
let testBtn = document.querySelector(".test")

// init grid
for (let i=0; i<nRow; i++) {
  for (let j=0; j<nCol; j++) {
    let div = document.createElement("div")
    div.style.position = "relative"
    div.setAttribute("row", i)
    div.setAttribute("col", j)
    if (girdMap[i][j] === gridType.START) {
      div.classList.add("start")
    } else if (girdMap[i][j] === gridType.END) {
      div.classList.add("end")
    } else if (girdMap[i][j] === gridType.WALL) {
      div.classList.add("wall")
    }
    div.classList.add("tile")
    div.style.width = `${600/nCol}px`
    div.style.height = `${480/nRow}px`

    let upText = document.createElement("div")
    upText.classList.add("qvalue")
    upText.textContent = `u: ${qtable.get(i, j, action.UP)}`
    gridTextElemet[i][j][action.UP] = upText
    div.appendChild(upText)

    let rightText = document.createElement("div")
    rightText.classList.add("qvalue")
    rightText.textContent = `r: ${qtable.get(i, j, action.RIGHT)}`
    gridTextElemet[i][j][action.RIGHT] = rightText
    div.appendChild(rightText)

    let downText = document.createElement("div")
    downText.classList.add("qvalue")
    downText.textContent = `d: ${qtable.get(i, j, action.DOWN)}`
    gridTextElemet[i][j][action.DOWN] = downText
    div.appendChild(downText)

    let leftText = document.createElement("div")
    leftText.classList.add("qvalue")
    leftText.textContent = `l: ${qtable.get(i, j, action.LEFT)}`
    gridTextElemet[i][j][action.LEFT] = leftText
    div.appendChild(leftText)

    gridElemet[i][j] = div
    grid.appendChild(div)
  }
}

gridElemet[currPosition.row][currPosition.col].className = "start"


function updateGrid(i, j, a) {
  let text = ""
  if (a === action.UP) {
    text += "u: "
  } else if (a === action.RIGHT) {
    text += "r: "
  } else if (a === action.DOWN) {
    text += "d: "
  } else if (a === action.LEFT) {
    text += "l: "
  }

  text += qtable.get(i, j, a).toFixed(2)
  gridTextElemet[i][j][a].textContent = text
}

function step(a) {
  let obs = {...currPosition}
  let reward = -1
  let terminated = false
  let dr = 0
  let dc = 0
  if (a === action.UP) {
    dr = -1
    dc = 0
  } else if (a === action.RIGHT) {
    dr = 0
    dc = 1
  } else if (a === action.DOWN) {
    dr = 1
    dc = 0
  } else if (a === action.LEFT) {
    dr = 0
    dc = -1
  }
  

  // find new position
  if (currPosition.row + dr < nRow && currPosition.row + dr >= 0) {
    obs.row = currPosition.row + dr
    currPosition.row = currPosition.row + dr
  } 
  if (currPosition.col + dc < nCol && currPosition.col + dc >= 0) {
    obs.col = currPosition.col + dc
    currPosition.col = currPosition.col + dc
  }

  // set reward
  if (girdMap[currPosition.row][currPosition.col] === gridType.WALL) {
    reward = -100
    terminated = true
  } else if (girdMap[currPosition.row][currPosition.col] === gridType.END) {
    reward = 100
    terminated = true
  }


  return {obs, reward, terminated}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function train() {
  for (let i=0; i<epoch; i++) {
    let reward
    let terminated = false
    let numStep = maxStep  
    currPosition = {row: 2, col: 2}

    while (!terminated && numStep > 0) {
      let action = 0
      if (Math.random() > epsilon) {
        action = qtable.maxAction(currPosition.row, currPosition.col)[0]
      } else {
        action = randInt(0, 3)
      }
      let oldPos = {...currPosition}
      let res = step(action)
      terminated = res.terminated
      reward = res.reward
      numStep--
    
      let qOld = qtable.get(oldPos.row, oldPos.col, action)
      let qNext = qtable.maxAction(currPosition.row, currPosition.col)[1]
      let qNew = qOld + alpha * (reward + gamma * qNext - qOld)
      qtable.set(oldPos.row, oldPos.col, action, qNew)
      updateGrid(oldPos.row, oldPos.col, action)
    }
  
    epsilon = Math.max(epsilon * epsilonDecay, epsilonMin)
  }
}

function resetTile(r, c) {
  if (girdMap[r][c] === gridType.END) {
    gridElemet[r][c].className = "end"
    girdMap[r][c] = gridType.END
  } else if (girdMap[r][c] === gridType.WALL) {
    gridElemet[r][c].className = "wall"
    girdMap[r][c] = gridType.WALL
  } else if (girdMap[r][c] === gridType.SPACE) {
    gridElemet[r][c].className = "tile"
    girdMap[r][c] = gridType.SPACE
  }
}


async function test() {
  let terminated = false
  let numStep = 20  

  resetTile(currPosition.row, currPosition.col)
  currPosition = {row: 2, col: 2}
  gridElemet[currPosition.row][currPosition.col].className = "start"

  while (!terminated && numStep > 0) {
    await sleep(250);
    let action = qtable.maxAction(currPosition.row, currPosition.col)[0]

    resetTile(currPosition.row, currPosition.col)

    let res = step(action)
    gridElemet[currPosition.row][currPosition.col].className = "start"
    terminated = res.terminated
    numStep--
  }
}


trainBtn.addEventListener("click", () => {
  resetTile(currPosition.row, currPosition.col)
  currPosition = {row: 2, col: 2}
  gridElemet[currPosition.row][currPosition.col].className = "start"
  train()
})

testBtn.addEventListener("click", async () => {
  trainBtn.disabled = true
  testBtn.disabled = true
  await test()
  trainBtn.disabled = false
  testBtn.disabled = false
})