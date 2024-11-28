class Quad extends Hittable {
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
    this.area = Vec3.length(n);
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
    let p = Vec3.add(Vec3.scale(this.u, Math.random()), Vec3.scale(this.v, Math.random()));
    p = Vec3.add(p, this.Q);
    return Vec3.sub(p, origin);
  }
}


function box(a, b, mat) {
  let sides = [];

  let min = vec3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
  let max = vec3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));

  let dx = vec3(max.x - min.x, 0, 0);
  let dy = vec3(0, max.y - min.y, 0);
  let dz = vec3(0, 0, max.z - min.z);

  sides.push(new Quad(vec3(min.x, min.y, max.z), dx, dy, mat));
  sides.push(new Quad(vec3(max.x, min.y, max.z), Vec3.scale(dz, -1), dy, mat));
  sides.push(new Quad(vec3(max.x, min.y, min.z), Vec3.scale(dx, -1), dy, mat));
  sides.push(new Quad(vec3(min.x, min.y, min.z), dz, dy, mat));
  sides.push(new Quad(vec3(min.x, max.y, max.z), dx, Vec3.scale(dz, -1), mat));
  sides.push(new Quad(vec3(min.x, min.y, min.z), dx, dz, mat));

  return sides;
}