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

function mix1d(a, b, t) {
  return a * (1-t) + b * t;
}

function mix3d(c1, c2, t) {
  return vec3(mix1d(c1.x, c2.x, t), mix1d(c1.y, c2.y, t), mix1d(c1.z, c2.z, t));
}