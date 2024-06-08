class Node {
  constructor(row, col, type) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.htmlElement = null;
    this.next = [];
    this.hoverElement = null;
  }

  initHtml(canvas, nodeSize, margin, horizontalGridSize, verticleGridSize) {
    let div = document.createElement("div");
    div.style.display = "none";
    div.style.position = "absolute";
    div.style.width = `${nodeSize}px`;
    div.style.height = `${nodeSize}px`;
    div.style.borderRadius = "100%";
    div.style.left = `${margin + horizontalGridSize*this.col - nodeSize/2}px`;
    div.style.bottom = `${margin + verticleGridSize*this.row - nodeSize}px`;
    div.style.backgroundColor = "gray";
    canvas.appendChild(div);
    this.htmlElement = div;
    this.setHoverElement();
    return div;
  }

  setType(type) {
    this.type = type;
  }

  setColor(color) {
    this.htmlElement.style.backgroundColor = color;
  }

  setHoverElement() {
    let div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    div.style.width = "120px";
    div.style.height = "70px";
    div.style.border = "1px solid black";
    div.style.backgroundColor = "white";
    div.style.color = "black";
    div.style.borderRadius = "10px";
    div.style.position = "absolute";
    div.style.pointerEvents = "none";
    div.style.zIndex = "1";
    div.style.left = `calc(${this.htmlElement.style.left} + ${this.htmlElement.style.width} + 10px)`;
    div.style.bottom = `calc(${this.htmlElement.style.bottom} + ${this.htmlElement.style.height} - 40px)`;
    div.innerHTML = `row: ${this.row}<br />col: ${this.col}<br />type :${this.type}`;
    div.style.display = "none";
    this.htmlElement.after(div);
    this.hoverElement = div;

    this.htmlElement.addEventListener("mouseover", event => {
      this.hoverElement.style.display = "flex";
    })

    this.htmlElement.addEventListener("mouseleave", event => {
      this.hoverElement.style.display = "none";
    })
  }
  
  setLeftPath() {
    let div = document.createElement("div");
    div.style.width = "90px";
    div.style.height = "5px";
    div.style.backgroundColor = "black";
    div.style.position = "absolute";
    div.style.left = `calc(${this.htmlElement.style.left} - 79px)`;
    div.style.bottom = `calc(${this.htmlElement.style.bottom} + 29px)`;
    div.style.transform = "rotate(30deg)";
    this.htmlElement.before(div);
  }

  setMidPath() {
    let div = document.createElement("div");
    div.style.width = "47px";
    div.style.height = "5px";
    div.style.backgroundColor = "black";
    div.style.position = "absolute";
    div.style.left = `calc(${this.htmlElement.style.left} - 15px)`;
    div.style.bottom = `calc(${this.htmlElement.style.bottom} + 23px)`;
    div.style.transform = "rotate(90deg)";
    this.htmlElement.before(div);
  }

  setRightPath() {
    let div = document.createElement("div");
    div.style.width = "90px";
    div.style.height = "5px";
    div.style.backgroundColor = "black";
    div.style.position = "absolute";
    div.style.left = `calc(${this.htmlElement.style.left} + 5px)`;
    div.style.bottom = `calc(${this.htmlElement.style.bottom} + 29px)`;
    div.style.transform = "rotate(-30deg)";
    this.htmlElement.before(div);
  }

  setType(type) {
    this.type = type;
    this.hoverElement.innerHTML = `row: ${this.row}<br />col: ${this.col}<br />type :${this.type}`;
  }

  setVisible() {
    this.htmlElement.style.display = "block";
  }
}