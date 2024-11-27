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

  print() {
    console.log("this is lambertian");
  }
}


class Matel extends Material {
  constructor(albedo) {
    super();
    this.albedo = albedo;

  }

  scatter(r_in, rec, attenuation, scattered) {
    let reflected = reflect(r_in.direction, rec.normal);

    Object.assign(scattered, new Ray(rec.p, reflected));
    Object.assign(attenuation, this.albedo);
    return true;
  }

  print(msg) {
    console.log("this is matel", msg);
  }
}