class HitRecord {
  constructor() {
    this.p = null;
    this.normal = null;
    this.t = null;
    this.front_face = null;
  }

  set_face_normal(r, outward_normal) {
    this.front_face = Vec3.dot(r.direction, outward_normal) < 0;
    this.normal = this.front_face ? outward_normal : Vec3.scale(outward_normal, -1);
  }
}


class Hittable {
  hit(r, ray_min, ray_max, rec) {
    return 0;
  }
}