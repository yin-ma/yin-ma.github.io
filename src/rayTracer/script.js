importScripts("util.js");
importScripts("vec3.js");
importScripts("ray.js");
importScripts("hittable.js");
importScripts("sphere.js");
importScripts("hittable_list.js");
importScripts("camera.js");


let world = new HittableList;
world.add(new Sphere(vec3(0, 0, -1), 0.5));
world.add(new Sphere(vec3(-1, 0, -1), 0.5));
world.add(new Sphere(vec3(1, 0, -1), 0.5));
world.add(new Sphere(vec3(0, -100.5, -1), 100));


self.onmessage = (msg) => {
  let {canvasWidth, canvasHeight} = msg.data;
  let cam = new Camera(canvasWidth, canvasHeight);

  cam.render(world, self);
}