class Ray {
  constructor(origin, direction, time=0) {
    this.origin = origin;
    this.direction = direction;
    this.time = time;
  }

  at(t) {
    return Vec3.add(this.origin, Vec3.scale(this.direction, t));
  }
}