class Sphere extends Hittable {
  constructor(center, radius, mat) {
    super();
    this.center = center;
    this.radius = radius;
    this.mat = mat;
  }

  hit(r, ray_min, ray_max, rec) {
    let current_center = this.center.at(r.time);
    let oc = Vec3.sub(current_center, r.origin);
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
    let outward_normal = Vec3.scale(Vec3.sub(rec.p, current_center), 1/this.radius);
    rec.set_face_normal(r, outward_normal);
    rec.mat = this.mat;
    return true;
  }

  pdf_value(origin, direction) {
    let rec = new HitRecord;

    if (!this.hit(new Ray(origin, direction), 0.001, Infinity, rec)) return 0;

    let dist_squared = Vec3.length_squared(Vec3.sub(this.center.at(0), origin));
    let cos_theta_max = Math.sqrt(1 - this.radius*this.radius/dist_squared);
    let solid_angle = 2 * Math.PI * (1-cos_theta_max);

    return 1 / solid_angle;
  }

  random(origin) {
    let direction = Vec3.sub(this.center.at(0), origin);
    let distance_squared = Vec3.length_squared(direction);
    let uvw = new ONB(direction);

    return uvw.transform(Sphere.random_to_sphere(this.radius, distance_squared));
  }

  static random_to_sphere(radius, distance_squared) {
    let r1 = Math.random();
    let r2 = Math.random();
    let z = 1 + r2 * (Math.sqrt(1 - radius*radius/distance_squared) - 1);

    let phi = 2 * Math.PI * r1;
    let x = Math.cos(phi) * Math.sqrt(1 - z*z);
    let y = Math.sin(phi) * Math.sqrt(1 - z*z);

    return vec3(x, y, z);
  }
}