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


class Translate extends Hittable {
  constructor(object, offset) {
    super();
    this.object = object;
    this.offset = offset;
  }

  hit(r, ray_min, ray_max, rec) {
    let offset_r = new Ray(Vec3.sub(r.origin, this.offset), r.direction, r.time);

    if (!this.object.hit(offset_r, ray_min, ray_max, rec)) return false;

    rec.p = Vec3.add(rec.p, this.offset);
    return true;

  }
}


class RotateY extends Hittable {
  constructor(object, angle) {
    super();
    this.object = object;
    this.sin_theta;
    this.cos_theta;
    
    let radians = degrees_to_radians(angle);
    this.sin_theta = Math.sin(radians);
    this.cos_theta = Math.cos(radians);

  }

  hit(r, ray_min, ray_max, rec) {

    let origin = vec3(
      this.cos_theta * r.origin.x - this.sin_theta * r.origin.z, 
      r.origin.y, 
      this.sin_theta * r.origin.x + this.cos_theta * r.origin.z
    );

    let direction = vec3(
      this.cos_theta * r.direction.x - this.sin_theta * r.direction.z, 
      r.direction.y, 
      this.sin_theta * r.direction.x + this.cos_theta * r.direction.z
    );

    let rotated_r = new Ray(origin, direction, r.time);

    if (!this.object.hit(rotated_r, ray_min, ray_max, rec)) return false;

    rec.p = vec3(
      this.cos_theta * rec.p.x + this.sin_theta * rec.p.z, 
      rec.p.y, 
      -this.sin_theta * rec.p.x + this.cos_theta * rec.p.z
    );

    rec.normal = vec3(
      this.cos_theta * rec.normal.x + this.sin_theta * rec.normal.z, 
      rec.normal.y, 
      -this.sin_theta * rec.normal.x + this.cos_theta * rec.normal.z
    );

    return true;


  }
}