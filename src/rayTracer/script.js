importScripts("util.js");
importScripts("vec3.js");
importScripts("ray.js");
importScripts("hittable.js");
importScripts("sphere.js");
importScripts("hittable_list.js");
importScripts("camera.js");
importScripts("material.js");


let world = new HittableList;

let material_ground = new Lambertian(color(0.8, 0.8, 0.0));
let material_center = new Lambertian(color(0.1, 0.2, 0.5));
let material_left = new Matel(color(0.8, 0.8, 0.8));
let material_right = new Matel(color(0.8, 0.6, 0.2));

world.add(new Sphere(vec3(0, -100.5, -1), 100, material_ground));
world.add(new Sphere(vec3(0, 0, -1.2), 0.5, material_center));
world.add(new Sphere(vec3(-1, 0, -1), 0.5, material_left));
world.add(new Sphere(vec3(1, 0, -1), 0.5, material_right));


self.onmessage = (msg) => {
  let {canvasWidth, canvasHeight} = msg.data;
  let cam = new Camera(canvasWidth, canvasHeight);

  cam.render(world, self);
}