importScripts("util.js");
importScripts("vec3.js");
importScripts("ray.js");
importScripts("hittable.js");
importScripts("sphere.js");
importScripts("quad.js");
importScripts("hittable_list.js");
importScripts("camera.js");
importScripts("material.js");


let world = new HittableList;

self.onmessage = (msg) => {
  let {canvasWidth, canvasHeight} = msg.data;
  let cam = new Camera(canvasWidth, canvasHeight);

  scene2(cam);
  cam.render(world, self);
}

function scene2(cam) {
  let left_red = new Lambertian(color(1.0, 0.2, 0.2));
  let back_green = new Lambertian(color(0.2, 1.0, 0.2));
  let right_blue = new Lambertian(color(0.2, 0.2, 1.0));
  let upper_orange = new Lambertian(color(1.0, 0.5, 0.1));
  let lower_teal = new Lambertian(color(0.2, 0.8, 0.8));

  world.add(new Quad(vec3(-3, -2, 5), vec3(0, 0, -4), vec3(0, 4, 0), left_red));
  world.add(new Quad(vec3(-2, -2, 0), vec3(4, 0, 0), vec3(0, 4, 0), back_green));
  world.add(new Quad(vec3(3, -2, 1), vec3(0, 0, 4), vec3(0, 4, 0), right_blue));
  world.add(new Quad(vec3(-2, 3, 1), vec3(4, 0, 0), vec3(0, 0, 4), upper_orange));
  world.add(new Quad(vec3(-2, -3, 5), vec3(4, 0, 0), vec3(0, 0, -4), lower_teal));

  cam.sample_per_pixel = 1;
  cam.max_depth = 9;
  cam.lookfrom = vec3(0, 0, 9);
  cam.lookat = vec3(0, 0, 0);
  cam.vup = vec3(0, 1, 0);
  cam.defocus_angle = 0;
  cam.vfov = 80;
}

function scene1(cam) {
  cam.sample_per_pixel = 9;
  cam.max_depth = 9;
  cam.lookfrom = vec3(13, 2, 3);
  cam.lookat = vec3(0, 0, 0);
  cam.vup = vec3(0, 1, 0);
  cam.vfov = 20;

  cam.defocus_angle = 0.4;
  cam.focus_dist = 10.0;

  let ground_material = new Lambertian(color(0.5, 0.5, 0.5));
  world.add(new Sphere(new Ray(vec3(0, -1000, 0), vec3(0, 0, 0)), 1000, ground_material));
  
  for (let a=-11; a<11; a++) {
    for (let b=-11; b<11; b++) {
      let choose_mat = Math.random();
      let center = vec3(a+0.9*Math.random(), 0.2, b+0.9*Math.random());
  
      if (Vec3.length(Vec3.sub(center, vec3(4, 0.2, 0))) > 0.9) {
        if (choose_mat < 0.8) {
          let albedo = Vec3.mul(Vec3.random(), Vec3.random());
          let sphere_material = new Lambertian(albedo);
          let center2 = Vec3.add(center, vec3(0, Math.random(), 0));
          world.add(new Sphere(new Ray(center, Vec3.sub(center2, center)), 0.2, sphere_material));
        } else if (choose_mat < 0.95) {
          let albedo = Vec3.rand_between(0.5, 1);
          let fuzz = rand_between(0, 0.5);
          let sphere_material = new Metal(albedo, fuzz);
          world.add(new Sphere(new Ray(center, vec3(0, 0, 0)), 0.2, sphere_material));
        } else {
          let sphere_material = new Dielectric(1.5);
          world.add(new Sphere(new Ray(center, vec3(0, 0, 0)), 0.2, sphere_material));
        }
      }
    }
  }
  
  let material1 = new Dielectric(1.5);
  world.add(new Sphere(new Ray(vec3(0, 1, 0), vec3(0, 0, 0)), 1.0, material1));
  let material2 = new Lambertian(vec3(0.4, 0.2, 0.1));
  world.add(new Sphere(new Ray(vec3(-4, 1, 0), vec3(0, 0, 0)), 1.0, material2));
  let material3 = new Metal(vec3(0.7, 0.6, 0.5), 0.0);
  world.add(new Sphere(new Ray(vec3(4, 1, 0), vec3(0, 0, 0)), 1.0, material3));
  
}