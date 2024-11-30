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
  let cam = CameraFactory.getCamera(msg.data[0]);

  msg.data.forEach(primitive_data => {
    switch (primitive_data["type"]) {
      case "quad":
        world.add(QuadFactory.getQuad(primitive_data));
        if (primitive_data["material"] === "light") {
          lights.add(QuadFactory.getQuad(primitive_data));
        }
        break;
      case "sphere":
        world.add(SphereFactory.getSphere(primitive_data));
        if (primitive_data["material"] === "light") {
          lights.add(SphereFactory.getSphere(primitive_data));
        }
        break;
      case "box":
        BoxFactory.getBox(primitive_data).forEach(b => {
          world.add(b);

          if (primitive_data["material"] === "light") {
            lights.add(b);
          }

        })
        break;
      case "triangle":
        world.add(TriangleFactory.getTriangle(primitive_data));
        if (primitive_data["material"] === "light") {
          lights.add(TriangleFactory.getTriangle(primitive_data));
        }
        break;
      default:
        break;
    }

  })

  cam.render(world, lights, self);
}
