class Camera {
  constructor(canvasWidth, canvasHeight) {
    this.image_width = canvasWidth;
    this.image_height = canvasHeight;
    this.aspect_ratio = canvasWidth / canvasHeight;
    this.center;
    this.pixel00_loc;
    this.pixel_delta_u;
    this.pixel_delta_v;

    this.sample_per_pixel = 9;
    this.pixel_samples_scale = 1/this.sample_per_pixel;
    this.max_depth = 9;
    this.vfov = 90;

    this.lookfrom = vec3(0, 0, 0);
    this.lookat = vec3(0, 0, -1);
    this.vup = vec3(0, 1, 0);

    this.defocus_angle = 0;
    this.focus_dist = 10;

    this.defocus_disk_u;
    this.defocus_disk_v;

    this.u;
    this.v;
    this.w;
  }

  render(world, worker) {
    this.initialize();

    let progress = 0;
    let progress_scale = 1 / this.image_height * 1 / this.sample_per_pixel;

    for (let sample=0; sample<this.sample_per_pixel; sample++) {
      progress = sample/this.sample_per_pixel*100;
      for (let j=0; j<this.image_height; j++) {
        progress += progress_scale * 100;
        for (let i=0; i<this.image_width; i++) {
          let r = this.get_ray(i, j);
          let pixel_color = this.ray_color(r, this.max_depth, world);

          worker.postMessage({progress, i, j, pixel_color, sample});
        }
      }
    }
  }

  get_ray(i, j) {
    let offset = this.sample_square();
    let pixel_sample = Vec3.add(this.pixel00_loc, Vec3.add(Vec3.scale(this.pixel_delta_u, i+offset.x), Vec3.scale(this.pixel_delta_v, j+offset.y)));
    let ray_origin = this.defocus_angle <= 0 ? this.center : this.defocus_disk_sample();
    let ray_direction = Vec3.sub(pixel_sample, ray_origin);
    let ray_time = Math.random();

    return new Ray(ray_origin, ray_direction, ray_time);
  }

  sample_square() {
    return vec3(Math.random() - 0.5, Math.random() - 0.5, 0);
  }

  defocus_disk_sample() {
    let p = random_in_unit_disk();
    let res = this.center;
    res = Vec3.add(res, Vec3.scale(this.defocus_disk_u, p.x));
    res = Vec3.add(res, Vec3.scale(this.defocus_disk_v, p.y));
    return res;
  }

  ray_color(r, depth, world) {
    if (depth === 0) return color(0, 0, 0);

    let rec = new HitRecord;

    if (world.hit(r, 0.001, Infinity, rec)) {
      let scattered = new Ray(vec3(0, 0, 0), vec3(1, 1, 1));
      let attenuation = color(1, 1, 1);

      if (rec.mat.scatter(r, rec, attenuation, scattered)) {
        return Vec3.mul(this.ray_color(scattered, depth-1, world), attenuation);
      } else {
        return color(0, 0, 0);
      }
    } else {
      let unit_direction = Vec3.normalize(r.direction);
      let a = 0.5 * (unit_direction.y + 1.0);
      return Vec3.add(Vec3.scale(color(1.0, 1.0, 1.0), 1-a), Vec3.scale(color(0.5, 0.7, 1.0), a));
    }
  }

  initialize() {
    this.center = this.lookfrom;
    
    let theta = degrees_to_radians(this.vfov);
    let h = Math.tan(theta / 2);
  
    let viewport_height = 2 * h * this.focus_dist;
    let viewport_width = viewport_height * this.image_width / this.image_height;

    this.w = Vec3.normalize(Vec3.sub(this.lookfrom, this.lookat));
    this.u = Vec3.normalize(Vec3.cross(this.vup, this.w));
    this.v = Vec3.cross(this.w, this.u);
    
    let viewport_u = Vec3.scale(this.u, viewport_width);
    let viewport_v = Vec3.scale(Vec3.scale(this.v, -1), viewport_height);
    
    this.pixel_delta_u = Vec3.scale(viewport_u, 1/this.image_width);
    this.pixel_delta_v = Vec3.scale(viewport_v, 1/this.image_height);

    let viewport_upper_left = this.center;
    viewport_upper_left = Vec3.sub(viewport_upper_left, Vec3.scale(this.w, this.focus_dist));
    viewport_upper_left = Vec3.sub(viewport_upper_left, Vec3.scale(viewport_u, 0.5));
    viewport_upper_left = Vec3.sub(viewport_upper_left, Vec3.scale(viewport_v, 0.5));
    
    this.pixel00_loc = Vec3.add(viewport_upper_left, Vec3.scale(Vec3.add(this.pixel_delta_u, this.pixel_delta_v), 0.5));
    this.pixel_samples_scale = 1/this.sample_per_pixel;

    let defocus_radius = this.focus_dist * Math.tan(degrees_to_radians(this.defocus_angle / 2));
    this.defocus_disk_u = Vec3.scale(this.u, defocus_radius);
    this.defocus_disk_v = Vec3.scale(this.v, defocus_radius);
  }
}