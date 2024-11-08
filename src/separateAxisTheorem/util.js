function rotateAbove(p5, v1, v2, ang) {
  let ca = Math.cos(ang);
  let sa = Math.sin(ang);

  let x = v1.x - v2.x;
  let y = v1.y - v2.y;

  let newX = ca * x - sa * y;
  let newY = sa * x + ca * y;

  newX += v2.x;
  newY += v2.y;

  return p5.createVector(newX, newY);
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}