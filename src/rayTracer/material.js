class Material {
  scatter(r_in, rec, attenuation, scattered, pdf) {
    return false;
  }

  emitted(u, v, p, rec) {
    return vec3(0, 0, 0);
  }

  scattering_pdf(r_in, rec, scattered) {
    return 0;
  }
}


class Lambertian extends Material {
  constructor(albedo) {
    super();
    this.albedo = albedo;

  }

  scatter(r_in, rec, attenuation, scattered, pdf) {

    let uvw = new ONB(rec.normal);
    let scatter_direction = uvw.transform(random_cosine_direction());

    Object.assign(scattered, new Ray(rec.p, Vec3.normalize(scatter_direction), r_in.time));
    Object.assign(attenuation, this.albedo);

    pdf.pdf_value = Vec3.dot(uvw.axis[2], scatter_direction) / Math.PI;
    return true;
  }

  scattering_pdf(r_in, rec, scattered) {
    let cos_theta = Vec3.dot(rec.normal, Vec3.normalize(scattered.direction));
    return cos_theta < 0 ? 0 : cos_theta / Math.PI;
  }
}


class Isotropic extends Material {
  constructor(albedo) {
    super();
    this.albedo = albedo;
  }

  scatter(r_in, rec, attenuation, scattered, pdf) {
    Object.assign(scattered, new Ray(rec.p, random_unit_vector(), r_in.time));
    Object.assign(attenuation, this.albedo);
    pdf.pdf_value = 1 / (4 * Math.PI);
    return true;
  }

  scattering_pdf(r_in, rec, scattered) {
    return 1 / (4 * Math.PI);
  }
}




class Metal extends Material {
  constructor(albedo, fuzz) {
    super();
    this.albedo = albedo;
    this.fuzz = fuzz;
  }

  scatter(r_in, rec, attenuation, scattered, pdf) {
    let reflected = reflect(r_in.direction, rec.normal);
    reflected = Vec3.add(Vec3.normalize(reflected), Vec3.scale(random_unit_vector(), this.fuzz));

    Object.assign(scattered, new Ray(rec.p, reflected, r_in.time));
    Object.assign(attenuation, this.albedo);
    return Vec3.dot(scattered.direction, rec.normal) > 0;
  }
}


class Dielectric extends Material {
  constructor(refraction_index) {
    super();
    this.refraction_index = refraction_index;
  }

  scatter(r_in, rec, attenuation, scattered, pdf) {
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

    Object.assign(scattered, new Ray(rec.p, direction, r_in.time));
    return true;
  }

  static reflectance(cosine, refraction_index) {
    let r0 = (1 - refraction_index) / (1 + refraction_index);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1-cosine, 5);
  }
}


class DiffuseLight extends Material {
  constructor(emit) {
    super();
    this.tex = emit;
  }

  emitted(u, v, p, rec) {
    if (!rec.front_face) return vec3(0, 0, 0);
    return this.tex;
  }
}