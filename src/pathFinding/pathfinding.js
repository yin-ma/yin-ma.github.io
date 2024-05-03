const gridSize = 30;

let canvas = document.querySelector(".canvas");
let grid = [];
let elementGrid = [];

let startIsDragging = false;
let endIsDragging = false;
let buildWall = false;
let removeWall = false;

gridInit();

function gridInit() {
  canvas.innerHTML = "";
  grid = [];
  elementGrid = [];
  for (let i=0; i<gridSize; i++) {
    let gridRow = [];
    let elementGridRow = [];
    for (let j=0; j<gridSize; j++) {
      let div = document.createElement("div");
      div.classList.add("grid");
      div.setAttribute("row", i);
      div.setAttribute("col", j);
      canvas.appendChild(div);
      gridRow.push(0);
      elementGridRow.push(div);
    }
    grid.push(gridRow);
    elementGrid.push(elementGridRow);
  }
  
  elementGrid[3][3].classList.add("start");
  elementGrid[gridSize-3-1][gridSize-3-1].classList.add("end");
}


document.addEventListener("drag", event => {
  event.preventDefault();
})

document.addEventListener("dragstart", event => {
  event.preventDefault();
})

document.addEventListener("mousedown", event =>{
  event.stopPropagation();
  if (!event.target.classList.contains("grid")) return;

  if (event.target.classList.contains("start")) {
    startIsDragging = true;
  } 
  else if (event.target.classList.contains("end")) {
    endIsDragging = true;
  }
  else if (event.target.classList.contains("wall")) {
    removeWall = true;
    event.target.classList.remove("wall");
  }
  else {
    buildWall = true;
    event.target.classList.add("wall");
  }
})


document.addEventListener("mouseup", event =>{
  event.stopPropagation();
  if (!event.target.classList.contains("grid")) return;

  startIsDragging = false;
  endIsDragging = false;
  buildWall = false;
  removeWall = false;
})

document.addEventListener("mouseover", event => {
  if (!event.target.classList.contains("grid")) return;

  if (startIsDragging === true) {
    if (event.target.classList.contains("end")) return;
    event.target.classList.add("start");
    event.target.classList.remove("wall");
  }
  else if (endIsDragging === true) {
    if (event.target.classList.contains("start")) return;
    event.target.classList.add("end");
    event.target.classList.remove("wall");
  } 
  else if (buildWall === true) {
    if (event.target.classList.contains("start") || event.target.classList.contains("end")) return ;
    event.target.classList.add("wall");
  }
  else if (removeWall === true) {
    event.target.classList.remove("wall");
  }
  event.stopPropagation();
})


document.addEventListener("mouseout" , event => {
  if (!event.target.classList.contains("grid")) return;

  if (startIsDragging === true) {
    event.target.classList.remove("start");
  }
  else if (endIsDragging === true) {
    event.target.classList.remove("end");
  }
  event.stopPropagation();
})