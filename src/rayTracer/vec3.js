class Vec3 {
  static creatVector(x, y, z) {
    return {x:x, y:y, z:z};
  }

  static add(a, b) {
    return {x: a.x+b.x, y:a.y+b.y, z:a.z+b.z};
  }

  static sub(a, b) {
    return {x: a.x-b.x, y:a.y-b.y, z:a.z-b.z};
  }

  static scale(a, t) {
    return {x: a.x*t, y:a.y*t, z:a.z*t};
  }

  static mul(a, b) {
    return {x: a.x*b.x, y:a.y*b.y, z:a.z*b.z};
  }

  static div(a, b) {
    return {x: a.x/b.x, y:a.y/b.y, z:a.z/b.z};
  }

  static length(a) {
    return Math.sqrt(Vec3.length_squared(a));
  }

  static length_squared(a) {
    return a.x*a.x + a.y*a.y + a.z*a.z;
  }

  static dot(a, b) {
    return a.x*b.x + a.y*b.y + a.z*b.z;
  }

  static cross(a, b) {
    return {x: a.y*b.z - a.z*b.y, y: a.z*b.x - a.x*b.z, z: a.x*b.y - a.y*b.x};
  }

  static normalize(a) {
    return Vec3.scale(a, 1/Vec3.length(a));
  }

  static random() {
    return Vec3.creatVector(Math.random(), Math.random(), Math.random());
  }

  static rand_between(min, max) {
    return Vec3.creatVector(rand_between(min, max), rand_between(min, max), rand_between(min, max));
  }

  static near_zero(v) {
    let s = 1e-8;
    return Math.abs(v.x) < s && Math.abs(v.y) < s && Math.abs(v.z) < s;
  }

  static clamp(v, a, b) {
    let x = clamp(v.x, a, b);
    let y = clamp(v.y, a, b);
    let z = clamp(v.z, a, b);
    return vec3(x, y, z);
  }
}

function color(r, g, b) {
  return Vec3.creatVector(r, g, b);
}

function vec3(x, y, z) {
  return Vec3.creatVector(x, y, z);
}

function random_unit_vector() {
  while (true) {
    let p = Vec3.rand_between(-1, 1);
    let lensq = Vec3.length_squared(p);

    if (lensq <= 1 && lensq > 1e-160) {
      return Vec3.scale(p, 1/Math.sqrt(lensq));
    }
  }
}

function random_on_hemisphere(normal) {
  let on_unit_sphere = random_unit_vector();

  if (Vec3.dot(on_unit_sphere, normal) > 0.0) {
    return on_unit_sphere;
  } else {
    return Vec3.scale(on_unit_sphere, -1);
  }
}

function reflect(v, n) {
  return Vec3.sub(v, Vec3.scale(n, Vec3.dot(v, n) * 2));
}

function refract(uv, n, etai_over_etat) {
  let cos_theta = Math.min(Vec3.dot(Vec3.scale(uv, -1), n), 1.0);
  let r_out_perp = Vec3.scale(Vec3.add(uv, Vec3.scale(n, cos_theta)), etai_over_etat);
  let factor = -1 * Math.sqrt(Math.abs(1 - Vec3.length_squared(r_out_perp)));
  let r_out_parallel = Vec3.scale(n, factor);

  return Vec3.add(r_out_perp, r_out_parallel);
}

function random_in_unit_disk() {
  while (true) {
    let p = vec3(rand_between(-1, 1), rand_between(-1, 1), 0);
    if (Vec3.length_squared(p) < 1) {
      return p;
    }
  }
}

function random_cosine_direction() {
  let r1 = Math.random();
  let r2 = Math.random();

  let phi = 2 * Math.PI * r1;
  let x = Math.cos(phi) * Math.sqrt(r2);
  let y = Math.sin(phi) * Math.sqrt(r2);
  let z = Math.sqrt(1 - r2);

  return vec3(x, y, z);
}