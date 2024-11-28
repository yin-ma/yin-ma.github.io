class PDF {
  value (direction) {
    return 0;
  }

  generate() {
    return vec3(0, 0, 0);
  }
}


class SpherePDF extends PDF {
  constructor() {
    super();
  }

  value (direction) {
    return 1 / (4 * Math.PI);
  }

  generate() {
    return random_unit_vector();
  }
}


class CosinePDF extends PDF {
  constructor(w) {
    super();
    this.uvw = new ONB(w);
  }

  value (direction) {
    let cos_theta = Vec3.dot(Vec3.normalize(direction), this.uvw.axis[2]);
    return Math.max(0, cos_theta / Math.PI);
  }

  generate() {
    return this.uvw.transform(random_cosine_direction());
  }
}


class HittablePDF extends PDF {
  constructor(objects, origin) {
    super();

    this.objects = objects;
    this.origin = origin;
  }

  value (direction) {
    return this.objects.pdf_value(this.origin, direction);
  }

  generate() {
    return this.objects.random(this.origin);
  }
}
