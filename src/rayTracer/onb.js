class ONB {
  constructor(n) {
    this.axis = [vec3(0, 0, 0), vec3(0, 0, 0), vec3(0, 0, 0)];

    this.axis[2] = Vec3.normalize(n);
    let a = Math.abs(this.axis[2].x) > 0.9 ? vec3(0, 1, 0) : vec3(1, 0, 0);
    this.axis[1] = Vec3.normalize(Vec3.cross(this.axis[2], a));
    this.axis[0] = Vec3.cross(this.axis[2], this.axis[1]);
  }

  transform(v) {
    let temp_u = Vec3.scale(this.axis[0], v.x);
    let temp_v = Vec3.scale(this.axis[1], v.y);
    let temp_w = Vec3.scale(this.axis[2], v.z);
    return Vec3.add(temp_u, Vec3.add(temp_v, temp_w));
  }
}