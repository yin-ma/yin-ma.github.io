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