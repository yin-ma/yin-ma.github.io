class Quaternion {
  constructor(w, x, y, z) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

function normalize(q) {
  let dist = len(q);
  if (dist !== 0) {
    return new Quaternion(q.w / dist, q.x / dist, q.y / dist, q.z / dist);
  }
  return q;
}

function len(q) {
  return Math.sqrt(Math.pow(q.w, 2) + Math.pow(q.x, 2) + Math.pow(q.y, 2) + Math.pow(q.z, 2));
}

function conjugate(q) {
  return new Quaternion(q.w, -q.x, -q.y, -q.z);
}

function multiply(q1, q2) {
  return new Quaternion(
    q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
    q1.x * q2.w + q1.w * q2.x - q1.z * q2.y + q1.y * q2.z,
    q1.y * q2.w + q1.z * q2.x + q1.w * q2.y - q1.x * q2.z,
    q1.z * q2.w - q1.y * q2.x + q1.x * q2.y + q1.w * q2.z
  );
}

function add(q1, q2) {
  return new Quaternion(q1.w + q2.w, q1.x + q2.x, q1.y + q2.y, q1.z + q2.z);
}

function dot(q1, q2) {
  return (q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z);
}

function scale(q, s) {
  return new Quaternion(s*q.w, s*q.x, s*q.y, s*q.z);
}

function slerp(q1, q2, t) {
  let theta = Math.acos(dot(q1, q2));
  let r1 = Math.sin((1-t) * theta) / Math.sin(theta);
  let r2 = Math.sin(t * theta) / Math.sin(theta);
  return add(scale(q1, r1), scale(q2, r2))
}
