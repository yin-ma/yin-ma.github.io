class HittableList extends Hittable {
  constructor() {
    super();

    this.objects = [];
  }

  clear() {
    this.objects = [];
  }

  add(object) {
    this.objects.push(object);
  }

  hit(r, ray_min, ray_max, rec) {
    let temp_rec = new HitRecord;
    let hit_anything = false;
    let closest_so_far = ray_max;

    this.objects.forEach(object => {
      if (object.hit(r, ray_min, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        Object.assign(rec, temp_rec);
      }
    })

    return hit_anything;
  }

  pdf_value(origin, direction) {
    let weight = 1 / this.objects.length;
    let sum = 0.0;

    this.objects.forEach(object => {
      sum += weight * object.pdf_value(origin, direction);
    })

    return sum;
  }

  random(origin) {
    let int_size = this.objects.length;

    return this.objects[randInt(0, int_size-1)].random(origin);
  }
}