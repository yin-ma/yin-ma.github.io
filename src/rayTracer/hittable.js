class HitRecord {
  constructor() {
    this.p;
    this.normal;
    this.t;
    this.front_face;
    this.mat;
    this.u;
    this.v;
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