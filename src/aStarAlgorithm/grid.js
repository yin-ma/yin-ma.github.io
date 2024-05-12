export class Grid {
  constructor(canvas, row, col) {
    this.canvas = canvas;
    this.row = row;
    this.col = col;
    this.gridSize = canvas.getBoundingClientRect().width / row;
    this.gridType = {
      space: 0,
      start: 1,
      end: 2,
      wall: 3,
      open: 4,
      close: 5,
      path: 6
    }
    this.grid = [];
    this.gridElement = [];
    this.init();
    this.initHTML();
  }

  init() {
    this.grid = []
    for(let i=0; i<this.row; i++) {
      let tempRow = [];
      for(let j=0; j<this.col; j++) {
        tempRow.push(
          {state: this.gridType.space, fCost: -1, gCost: 0, hCost: 0}
        );
      }
      this.grid.push(tempRow);
    }
  }

  initHTML() {
    this.gridElement = [];
    this.canvas.innerHTML = "";
    for (let i=0; i<this.row; i++) {
      let rowElement = document.createElement("div");
      let rowArray = [];
      rowElement.classList.add("grid-row");
      rowElement.setAttribute("row", i);
      for (let j=0; j<this.col; j++) {
        let colElement = document.createElement("div");
        colElement.classList.add("grid-col");
        colElement.style.width = `${this.gridSize}px`;
        colElement.style.height = `${this.gridSize}px`;
        colElement.setAttribute("row", i);
        colElement.setAttribute("col", j);
        rowElement.appendChild(colElement);
        rowArray.push(colElement);
      }
      this.canvas.appendChild(rowElement);
      this.gridElement.push(rowArray);
    }
  }

  draw() {
    for (let i=0; i<this.row; i++) {
      for (let j=0; j<this.col; j++) {
        let element = this.gridElement[i][j];
        element.innerHTML = "";
        let fCost = document.createElement("p");
        let gCost = document.createElement("p");
        let hCost = document.createElement("p");
        switch (this.grid[i][j].state) {
          case this.gridType.space:
            element.style.backgroundColor = "snow";
            break;
          case this.gridType.start:
            element.style.backgroundColor = "cornflowerblue";
            let startText = document.createElement("p");
            startText.style.alignSelf = "center";
            startText.style.display = "flex";
            startText.style.alignItems = "center";
            startText.style.justifyContent = "center";
            startText.textContent = "S";
            startText.style.fontSize = "2rem";
            element.appendChild(startText);
            break;
          case this.gridType.end:
            element.style.backgroundColor = "coral";
            let endText = document.createElement("p");
            endText.style.alignSelf = "center";
            endText.style.display = "flex";
            endText.style.alignItems = "center";
            endText.style.justifyContent = "center";
            endText.textContent = "E";
            endText.style.fontSize = "2rem";
            element.appendChild(endText);
            break;
          case this.gridType.wall:
            element.style.backgroundColor = "black";
            break;
          case this.gridType.open:
            element.style.backgroundColor = "green";
            fCost.textContent = `f: ${this.grid[i][j].fCost}`;
            gCost.textContent = `g: ${this.grid[i][j].gCost}`;
            hCost.textContent = `h: ${this.grid[i][j].hCost}`;
            element.appendChild(fCost);
            element.appendChild(gCost);
            element.appendChild(hCost);
            break;
          case this.gridType.close:
            element.style.backgroundColor = "red";
            fCost.textContent = `f: ${this.grid[i][j].fCost}`;
            gCost.textContent = `g: ${this.grid[i][j].gCost}`;
            hCost.textContent = `h: ${this.grid[i][j].hCost}`;
            element.appendChild(fCost);
            element.appendChild(gCost);
            element.appendChild(hCost);
            break;
          case this.gridType.path:
            element.style.backgroundColor = "violet";
            fCost.textContent = `f: ${this.grid[i][j].fCost}`;
            gCost.textContent = `g: ${this.grid[i][j].gCost}`;
            hCost.textContent = `h: ${this.grid[i][j].hCost}`;
            element.appendChild(fCost);
            element.appendChild(gCost);
            element.appendChild(hCost);
            break;
          default:
            break;
        }
      }
    }
  }

  reset() {
    for (let i=0; i<this.row; i++) {
      for (let j=0; j<this.col; j++) {
        if (this.grid[i][j].state === this.gridType.start || 
          this.grid[i][j].state === this.gridType.end ||
          this.grid[i][j].state === this.gridType.wall
        ) continue;
        this.grid[i][j] = {state: this.gridType.space, fCost: -1, gCost: 0, hCost: 0};
      }
    }
  }
}