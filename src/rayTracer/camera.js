class Camera {
  constructor(canvasWidth, canvasHeight) {
    this.image_width = canvasWidth;
    this.image_height = canvasHeight;
    this.aspect_ratio = canvasWidth / canvasHeight;
    this.center;
    this.pixel00_loc;
    this.pixel_delta_u;
    this.pixel_delta_v;
  }

  render(world, woker) {
    this.initialize();

    let progress = 0;

    for (let j=0; j<this.image_height; j++) {
      progress = (j+1)/this.image_height*100;
      for (let i=0; i<this.image_width; i++) {
        let pixel_center = Vec3.add(this.pixel00_loc, Vec3.add(Vec3.scale(this.pixel_delta_u, i), Vec3.scale(this.pixel_delta_v, j)));
        let ray_direction = Vec3.sub(pixel_center, this.center);
        let r = new Ray(this.center, ray_direction);
        let color = this.ray_color(r, world);
        
        woker.postMessage({progress, i, j, color});
      }
    }
  }

  ray_color(r, world) {
    let rec = new HitRecord;
    if (world.hit(r, 0, 100, rec)) {
      let N = rec.normal;
      return Vec3.scale(color(N.x+1, N.y+1, N.z+1), 0.5);
    } else {
      let unit_direction = Vec3.normalize(r.direction);
      let a = 0.5 * (unit_direction.y + 1.0);
      return Vec3.add(Vec3.scale(color(1.0, 1.0, 1.0), 1-a), Vec3.scale(color(0.5, 0.7, 1.0), a));
    }
  }

  initialize() {
    this.center = vec3(0, 0, 0);

    let focal_length = 1.0;
    let viewport_height = 2.0;
    let viewport_width = viewport_height * this.image_width / this.image_height;
    
    let viewport_u = vec3(viewport_width, 0, 0);
    let viewport_v = vec3(0, -viewport_height, 0);
    
    this.pixel_delta_u = Vec3.scale(viewport_u, 1/this.image_width);
    this.pixel_delta_v = Vec3.scale(viewport_v, 1/this.image_height);
    
    let viewport_upper_left = Vec3.sub(this.center, vec3(0, 0, focal_length));
    viewport_upper_left = Vec3.sub(viewport_upper_left, Vec3.scale(viewport_u, 0.5));
    viewport_upper_left = Vec3.sub(viewport_upper_left, Vec3.scale(viewport_v, 0.5));
    
    this.pixel00_loc = Vec3.add(viewport_upper_left, Vec3.scale(Vec3.add(this.pixel_delta_u, this.pixel_delta_v), 0.5));
  }
}