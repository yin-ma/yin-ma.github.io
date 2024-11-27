importScripts("util.js");
importScripts("vec3.js");
importScripts("ray.js");
importScripts("hittable.js");
importScripts("sphere.js");
importScripts("hittable_list.js");
importScripts("camera.js");
importScripts("material.js");


let world = new HittableList;

let ground_material = new Lambertian(color(0.5, 0.5, 0.5));
world.add(new Sphere(vec3(0, -1000, 0), 1000, ground_material));

for (let a=-11; a<11; a++) {
  for (let b=-11; b<11; b++) {
    let choose_mat = Math.random();
    let center = vec3(a+0.9*Math.random(), 0.2, b+0.9*Math.random());

    if (Vec3.length(Vec3.sub(center, vec3(4, 0.2, 0))) > 0.9) {
      if (choose_mat < 0.8) {
        let albedo = Vec3.mul(Vec3.random(), Vec3.random());
        let sphere_material = new Lambertian(albedo);
        world.add(new Sphere(center, 0.2, sphere_material));
      } else if (choose_mat < 0.95) {
        let albedo = Vec3.rand_between(0.5, 1);
        let fuzz = rand_between(0, 0.5);
        let sphere_material = new Metal(albedo, fuzz);
        world.add(new Sphere(center, 0.2, sphere_material));
      } else {
        let sphere_material = new Dielectric(1.5);
        world.add(new Sphere(center, 0.2, sphere_material));
      }
    }
  }
}

let material1 = new Dielectric(1.5);
world.add(new Sphere(vec3(0, 1, 0), 1.0, material1));
let material2 = new Lambertian(vec3(0.4, 0.2, 0.1));
world.add(new Sphere(vec3(-4, 1, 0), 1.0, material2));
let material3 = new Metal(vec3(0.7, 0.6, 0.5), 0.0);
world.add(new Sphere(vec3(4, 1, 0), 1.0, material3));


self.onmessage = (msg) => {
  let {canvasWidth, canvasHeight} = msg.data;
  let cam = new Camera(canvasWidth, canvasHeight);

  cam.sample_per_pixel = 50;
  cam.max_depth = 50;
  cam.lookfrom = vec3(13, 2, 3);
  cam.lookat = vec3(0, 0, 0);
  cam.vup = vec3(0, 1, 0);
  cam.vfov = 20;

  cam.defocus_angle = 0.4;
  cam.focus_dist = 10.0;

  cam.render(world, self);
}