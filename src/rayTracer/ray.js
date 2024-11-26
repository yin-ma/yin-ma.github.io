class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  at(t) {
    return Vec3.add(this.origin, Vec3.scale(this.direction, t));
  }
}