class Sphere extends Hittable {
  constructor(center, radius) {
    super();
    this.center = center;
    this.radius = radius;
  }

  hit(r, ray_min, ray_max, rec) {
    let oc = Vec3.sub(this.center, r.origin);
    let a = Vec3.length_squared(r.direction);
    let h = Vec3.dot(r.direction, oc);
    let c = Vec3.length_squared(oc) - this.radius*this.radius;
  
    let discriminant = h*h - a*c;
  
    if (discriminant < 0) return false;

    let sqrtd = Math.sqrt(discriminant);
    let root = (h - sqrtd) / a;

    if (root <= ray_min || root >= ray_max) {
      root = (h + sqrtd) / a;
      if (root <= ray_min || root >= ray_max) {
        return false;
      }
    }

    rec.t = root;
    rec.p = r.at(rec.t);
    let outward_normal = Vec3.scale(Vec3.sub(rec.p, this.center), 1/this.radius);
    rec.set_face_normal(r, outward_normal);
    return true;
  }
}