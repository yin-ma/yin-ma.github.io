export function rgbMixRandom(p5, color, w=0.9) {

  let temp_w = Math.max(Math.min(1, w), 0);

  let r = randomInt(0, 255);
  let g = randomInt(0, 255);
  let b = randomInt(0, 255);

  // mix
  r = (1 - temp_w) * r + temp_w * p5.red(color);
  g = (1 - temp_w) * g + temp_w * p5.green(color);
  b = (1 - temp_w) * b + temp_w * p5.blue(color);

  p5.red(color, parseInt(r));
  p5.green(color, parseInt(g));
  p5.blue(color, parseInt(b));

  return color;
}