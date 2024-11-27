class Material {
  scatter(r_in, rec, attenuation, scattered) {
    return false;
  }
}


class Lambertian extends Material {
  constructor(albedo) {
    super();
    this.albedo = albedo;

  }

  scatter(r_in, rec, attenuation, scattered) {
    let scatter_direction = Vec3.add(rec.normal, random_unit_vector());

    if (Vec3.near_zero(scatter_direction)) {
      scatter_direction = rec.normal;
    }
    Object.assign(scattered, new Ray(rec.p, scatter_direction));
    Object.assign(attenuation, this.albedo);
    return true;
  }
}


class Metal extends Material {
  constructor(albedo, fuzz) {
    super();
    this.albedo = albedo;
    this.fuzz = fuzz;
  }

  scatter(r_in, rec, attenuation, scattered) {
    let reflected = reflect(r_in.direction, rec.normal);
    reflected = Vec3.add(Vec3.normalize(reflected), Vec3.scale(random_unit_vector(), this.fuzz));

    Object.assign(scattered, new Ray(rec.p, reflected));
    Object.assign(attenuation, this.albedo);
    return Vec3.dot(scattered.direction, rec.normal) > 0;
  }
}


class Dielectric extends Material {
  constructor(refraction_index) {
    super();
    this.refraction_index = refraction_index;
  }

  scatter(r_in, rec, attenuation, scattered) {
    Object.assign(attenuation, color(1, 1, 1));

    let ri = rec.front_face ? (1.0 / this.refraction_index) : this.refraction_index;
    let unit_direction = Vec3.normalize(r_in.direction);

    let cos_theta = Math.min(Vec3.dot(Vec3.scale(unit_direction, -1), rec.normal), 1.0);
    let sin_theta = Math.sqrt(1 - cos_theta * cos_theta);

    let cannot_refract = ri * sin_theta > 1.0;
    let direction;

    if (cannot_refract || this.constructor.reflectance(cos_theta, ri) > Math.random()) {
      direction = reflect(unit_direction, rec.normal);
    } else {
      direction = refract(unit_direction, rec.normal, ri);
    }

    Object.assign(scattered, new Ray(rec.p, direction));
    return true;
  }

  static reflectance(cosine, refraction_index) {
    let r0 = (1 - refraction_index) / (1 + refraction_index);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1-cosine, 5);
  }
}