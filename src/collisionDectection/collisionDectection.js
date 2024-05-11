// point-circle collision
let pcCanvas = document.querySelector(".pc-canvas");
let pcCursor = document.querySelector(".pc-cursor");
let pcCircle = document.querySelector(".pc-circle");

pcCanvas.addEventListener("mousemove", event => {
  let canvasRect = pcCanvas.getBoundingClientRect();
  let cursorRect = pcCursor.getBoundingClientRect();
  let circleRect = pcCircle.getBoundingClientRect();
  let cursorX = cursorRect.left + cursorRect.width / 2;
  let cursorY = cursorRect.top + cursorRect.height / 2;
  let cursorR = cursorRect.width / 2;
  let circleX = circleRect.left + circleRect.width / 2;
  let circleY = circleRect.top + circleRect.height / 2;
  let circleR = circleRect.width / 2;
  
  pcCursor.style.left = `${event.clientX - canvasRect.left - cursorRect.width / 2}px`;
  pcCursor.style.top = `${event.clientY - canvasRect.top - cursorRect.height / 2}px`;

  if (Math.pow((circleX - cursorX), 2) + Math.pow((circleY - cursorY), 2) <= Math.pow((circleR), 2)) {
    pcCircle.style.backgroundColor = "darkorange";
  } else {
    pcCircle.style.backgroundColor = "greenyellow";
  }
});


// circle-circle collision
let ccCanvas = document.querySelector(".cc-canvas");
let ccCursor = document.querySelector(".cc-cursor");
let ccCircle = document.querySelector(".cc-circle");

ccCanvas.addEventListener("mousemove", event => {
  let canvasRect = ccCanvas.getBoundingClientRect();
  let cursorRect = ccCursor.getBoundingClientRect();
  let circleRect = ccCircle.getBoundingClientRect();
  let cursorX = cursorRect.left + cursorRect.width / 2;
  let cursorY = cursorRect.top + cursorRect.height / 2;
  let cursorR = cursorRect.width / 2;
  let circleX = circleRect.left + circleRect.width / 2;
  let circleY = circleRect.top + circleRect.height / 2;
  let circleR = circleRect.width / 2;
  
  ccCursor.style.left = `${event.clientX - canvasRect.left - cursorRect.width / 2}px`;
  ccCursor.style.top = `${event.clientY - canvasRect.top - cursorRect.height / 2}px`;

  if (Math.pow((circleX - cursorX), 2) + Math.pow((circleY - cursorY), 2) <= Math.pow((circleR+cursorR), 2)) {
    ccCircle.style.backgroundColor = "darkorange";
  } else {
    ccCircle.style.backgroundColor = "greenyellow";
  }
});


// point-rectangle collision
let prCanvas = document.querySelector(".pr-canvas");
let prCursor = document.querySelector(".pr-cursor");
let prRect = document.querySelector(".pr-rect");

prCanvas.addEventListener("mousemove", event => {
  let canvasRect = prCanvas.getBoundingClientRect();
  let cursorRect = prCursor.getBoundingClientRect();
  let rectRect = prRect.getBoundingClientRect();
  let cursorX = cursorRect.left + cursorRect.width / 2;
  let cursorY = cursorRect.top + cursorRect.height / 2;
  let rectX = rectRect.left;
  let rectY = rectRect.top;
  let rectWidth = rectRect.width;
  let rectHeight = rectRect.height;
  
  prCursor.style.left = `${event.clientX - canvasRect.left - cursorRect.width / 2}px`;
  prCursor.style.top = `${event.clientY - canvasRect.top - cursorRect.height / 2}px`;

  if (
    rectX <= cursorX &&
    cursorX <= rectX+rectWidth && 
    rectY <= cursorY &&
    cursorY <= rectY+rectHeight
  ) {
    prRect.style.backgroundColor = "darkorange";
  } else {
    prRect.style.backgroundColor = "greenyellow";
  }
});


// rectangle-rectangle collision
let rrCanvas = document.querySelector(".rr-canvas");
let rrCursor = document.querySelector(".rr-cursor");
let rrRect = document.querySelector(".rr-rect");

rrCanvas.addEventListener("mousemove", event => {
  let canvasRect = rrCanvas.getBoundingClientRect();
  let cursorRect = rrCursor.getBoundingClientRect();
  let rectRect = rrRect.getBoundingClientRect();
  let cursorX = cursorRect.left;
  let cursorY = cursorRect.top;
  let cursorWidth = cursorRect.width;
  let cursorHeight = cursorRect.height;
  let rectX = rectRect.left;
  let rectY = rectRect.top;
  let rectWidth = rectRect.width;
  let rectHeight = rectRect.height;
  
  rrCursor.style.left = `${event.clientX - canvasRect.left - cursorRect.width / 2}px`;
  rrCursor.style.top = `${event.clientY - canvasRect.top - cursorRect.height / 2}px`;

  if (
    cursorX <= rectX + rectWidth &&
    rectX <= cursorX + cursorWidth && 
    cursorY <= rectY + rectHeight &&
    rectY <= cursorY + cursorHeight
  ) {
    rrRect.style.backgroundColor = "darkorange";
  } else {
    rrRect.style.backgroundColor = "greenyellow";
  }
});


// rectangle-circle collision
let rcCanvas = document.querySelector(".rc-canvas");
let rcCursor = document.querySelector(".rc-cursor");
let rcRect = document.querySelector(".rc-rect");

rcCanvas.addEventListener("mousemove", event => {
  let canvasRect = rcCanvas.getBoundingClientRect();
  let cursorRect = rcCursor.getBoundingClientRect();
  let rectRect = rcRect.getBoundingClientRect();
  let cursorX = cursorRect.left + cursorRect.width / 2;
  let cursorY = cursorRect.top + cursorRect.width / 2;
  let cursorR = cursorRect.width / 2;
  let rectX = rectRect.left;
  let rectY = rectRect.top;
  let rectWidth = rectRect.width;
  let rectHeight = rectRect.height;
  
  rcCursor.style.left = `${event.clientX - canvasRect.left - cursorRect.width / 2}px`;
  rcCursor.style.top = `${event.clientY - canvasRect.top - cursorRect.height / 2}px`;

  let textX = cursorX;
  let textY = cursorY;

  if (cursorX < rectX) { textX = rectX; }
  else if (cursorX > rectX + rectWidth) { textX = rectX + rectWidth; }

  if (cursorY < rectY) { textY = rectY; }
  else if (cursorY > rectY + rectHeight) { textY = rectY + rectHeight; }

  if (Math.pow((cursorX - textX), 2) + Math.pow((cursorY - textY), 2) <= Math.pow(cursorR, 2)) {
    rcRect.style.backgroundColor = "darkorange";
  } else {
    rcRect.style.backgroundColor = "greenyellow";
  }
});