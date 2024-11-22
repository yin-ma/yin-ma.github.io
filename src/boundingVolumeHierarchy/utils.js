function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomColor(p) {
  return p.color(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
}
