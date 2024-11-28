class ScatterRecord {
  constructor() {
    this.attenuation;
    this.pdf_ptr;
    this.skip_pdf;
    this.skip_pdf_ray;
  }
}


class Material {
  scatter(r_in, rec, srec) {
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

  scatter(r_in, rec, srec) {
    srec.attenuation = this.albedo;
    srec.pdf_ptr = new CosinePDF(rec.normal);
    srec.skip_pdf = false;
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

  scatter(r_in, rec, srec) {
    srec.attenuation = this.albedo;
    srec.pdf_ptr = new SpherePDF();
    srec.skip_pdf = false;
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

  scatter(r_in, rec, srec) {
    let reflected = reflect(r_in.direction, rec.normal);
    reflected = Vec3.add(Vec3.normalize(reflected), Vec3.scale(random_unit_vector(), this.fuzz));

    srec.attenuation = this.albedo;
    srec.pdf_ptr = null;
    srec.skip_pdf = true;
    srec.skip_pdf_ray = new Ray(rec.p, reflected, r_in.time);

    return true;
  }
}


class Dielectric extends Material {
  constructor(refraction_index) {
    super();
    this.refraction_index = refraction_index;
  }

  scatter(r_in, rec, srec) {
    srec.attenuation = color(1.0, 1.0, 1.0);
    srec.pdf_ptr = null;
    srec.skip_pdf = true;

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

    srec.skip_pdf_ray = new Ray(rec.p, direction, r_in.time);
    
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