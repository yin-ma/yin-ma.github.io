class Triangle extends Hittable {
  constructor(Q, u, v, mat) {
    super();
    this.Q = Q;
    this.u = u;
    this.v = v;
    this.mat = mat;
    this.normal;
    this.D;
    this.w;
    this.area;

    let n = Vec3.cross(u, v);
    this.normal = Vec3.normalize(n);
    this.D = Vec3.dot(this.normal, this.Q);
    this.w = Vec3.scale(n, 1 / Vec3.dot(n, n));
    this.area = Vec3.length(n) / 2;
  }

  hit(r, ray_min, ray_max, rec) {
    let denom = Vec3.dot(this.normal, r.direction);
    if (Math.abs(denom) < 1e-8) return false;

    let t = (this.D - Vec3.dot(this.normal, r.origin)) / denom;
    if (!(ray_min <= t && ray_max >= t)) return false;

    let intersection = r.at(t);
    let planar_hitpt_vector = Vec3.sub(intersection, this.Q);
    let alpha = Vec3.dot(this.w, Vec3.cross(planar_hitpt_vector, this.v));
    let beta = Vec3.dot(this.w, Vec3.cross(this.u, planar_hitpt_vector));

    if(!this.is_interior(alpha, beta, rec)) return false;

    rec.t = t;
    rec.p = intersection;
    rec.mat = this.mat;
    rec.set_face_normal(r, this.normal);

    return true;
  }

  is_interior(a, b, rec) {
    let min = 0;
    let max = 1;

    if (!(min <= a && max >= a) || !(min <= b && max >= b)) return false;
    if (a+b > 1) return false;

    rec.u = a;
    rec.v = b;
    return true;
  }

  pdf_value(origin, direction) {
    let rec = new HitRecord;
    if (!this.hit(new Ray(origin, direction), 0.001, Infinity, rec)) {
      return 0;
    }

    let distance_squared = rec.t * rec.t * Vec3.length_squared(direction);
    let cosine = Math.abs(Vec3.dot(direction, rec.normal)) / Vec3.length(direction);

    return distance_squared / (cosine * this.area);
  }

  random(origin) {
    let a;
    let b;

    while (true) {
      a = Math.random();
      b = Math.random();

      if (a + b <= 1.0) {
        break;
      }
    }

    let p = Vec3.add(Vec3.scale(this.u, a), Vec3.scale(this.v, b));
    p = Vec3.add(p, this.Q);
    return Vec3.sub(p, origin);
  }
}