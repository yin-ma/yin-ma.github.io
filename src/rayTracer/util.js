function degrees_to_radians(degrees) {
  return degrees * Math.PI / 180;
}

function rand_between(min, max) {
  return min + (max - min) * Math.random();
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}