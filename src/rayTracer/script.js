importScripts("util.js");
importScripts("vec3.js");
importScripts("ray.js");
importScripts("onb.js");
importScripts("pdf.js");
importScripts("hittable.js");
importScripts("sphere.js");
importScripts("quad.js");
importScripts("triangle.js");
importScripts("hittable_list.js");
importScripts("camera.js");
importScripts("material.js");
importScripts("factory.js");


let world;
let lights;

self.onmessage = (msg) => {

  world = new HittableList;
  lights = new HittableList;
  let cam = CameraFactory.get(msg.data[0]);
  
  msg.data.forEach(primitive_data => {
    if (primitive_data["type"] === "camera") return;

    let fact;

    switch (primitive_data["type"]) {
      case "quad":
        fact = QuadFactory;
        break;
      case "sphere":
        fact = SphereFactory;
        break;
      case "box":
        fact = BoxFactory;
        break;
      case "triangle":
        fact = TriangleFactory;
        break;
      default:
        break;
    }

    let obj = fact.get(primitive_data);
    fact.add(obj, world, lights);

  })

  cam.render(world, lights, self);
}
