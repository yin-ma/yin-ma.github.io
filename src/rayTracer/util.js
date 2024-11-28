function degrees_to_radians(degrees) {
  return degrees * Math.PI / 180;
}

function rand_between(min, max) {
  return min + (max - min) * Math.random();
}

function randInt(min, max) {
  return Math.floor(rand_between(min, max));
}

function clamp(x, a, b) {
  return Math.min(b, Math.max(a, x));
}

function linear_to_gamma(linear_component) {
  if (linear_component > 0) {
    return Math.sqrt(linear_component);
  } else {
    return 0;
  }
}

