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


let world = new HittableList;
let lights = new HittableList;

self.onmessage = (msg) => {
  let cam = CameraFactory.getCamera(msg.data[0]);

  // msg.data.forEach(primitive_data => {
  //   switch (primitive_data["type"]) {
  //     case "quad":
  //       world.add(QuadFactory.getQuad(primitive_data));
  //       if (primitive_data["material"] === "light") {
  //         lights.add(QuadFactory.getQuad(primitive_data));
  //       }
  //       break;
  //     case "sphere":
  //       world.add(SphereFactory.getSphere(primitive_data));
  //       if (primitive_data["material"] === "light") {
  //         lights.add(SphereFactory.getSphere(primitive_data));
  //       }
  //       break;
  //     case "box":
  //       BoxFactory.getBox(primitive_data).forEach(b => {
  //         world.add(b);

  //         if (primitive_data["material"] === "light") {
  //           lights.add(b);
  //         }

  //       })
  //       break;
  //     case "triangle":
  //       world.add(TriangleFactory.getTriangle(primitive_data));
  //       if (primitive_data["material"] === "light") {
  //         lights.add(TriangleFactory.getTriangle(primitive_data));
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  // })

  //let cam = new Camera(200, 150);

  testScene(cam);

  cam.render(world, lights, self);
}

function testScene(cam) {
  let light = new DiffuseLight(color(15, 15, 15));
  let red = new Lambertian(color(0.65, 0.05, 0.05));

  cam.vfov = 90;
  cam.sample_per_pixel = 2;
  cam.max_depth = 2;

  world.add(new Sphere(new Ray(vec3(0, 1, 0), vec3(0, 0, 0)), 0.3, light));
  world.add(new Sphere(new Ray(vec3(0, 0.3, 0), vec3(0, 0, 0)), 0.3, red))
  lights.add(new Sphere(new Ray(vec3(0, 1, 0), vec3(0, 0, 0)), 0.3, light));

}

function scene2(cam) {
  let red = new Lambertian(color(0.65, 0.05, 0.05));
  let white = new Lambertian(color(0.73, 0.73, 0.73));
  let green = new Lambertian(color(0.12, 0.45, 0.15));
  let light = new DiffuseLight(color(15, 15, 15));
  let aluminum = new Metal(vec3(0.8, 0.85, 0.88), 0.0);
  let dimlight = new DiffuseLight(color(2.0, 0.15, 0.15));
  
  world.add(new Quad(vec3(555, 0, 0), vec3(0, 555, 0), vec3(0, 0, 555), green));
  world.add(new Triangle(vec3(0, 0, 0), vec3(0, 555, 0), vec3(0, 0, 555), red));

  world.add(new Triangle(vec3(0, 555, 555), vec3(0, -555, 0), vec3(0, 0, -555), dimlight));

  world.add(new Quad(vec3(343, 554, 332), vec3(-130, 0, 0), vec3(0, 0, -105), light));
  world.add(new Quad(vec3(0, 0, 0), vec3(555, 0, 0), vec3(0, 0, 555), white));
  world.add(new Quad(vec3(555, 555, 555), vec3(-555, 0, 0), vec3(0, 0, -555), white));
  world.add(new Quad(vec3(0, 0, 555), vec3(555, 0, 0), vec3(0, 555, 0), white));

  
  let box1 = box(vec3(0, 0, 0), vec3(400, 400, 100), white);
  box1.forEach(b => {
    let temp = new RotateY(b, 15);
    temp = new Translate(temp, vec3(265, 0, 295));
    world.add(temp);
  });
  
  let glass = new Dielectric(1.5);
  //world.add(new Sphere(new Ray(vec3(190, 90, 190), vec3(0, 0, 0)), 90, glass));
  world.add(new Triangle(vec3(190, 90, 190), vec3(130, 20, -35), vec3(22, 234, -23), red));
  lights.add(new Quad(vec3(343, 554, 332), vec3(-130, 0, 0), vec3(0, 0, -105), null));
  lights.add(new Triangle(vec3(0, 555, 555), vec3(0, -555, 0), vec3(0, 0, -555), null));

  cam.sample_per_pixel = 4;
  cam.max_depth = 8;
  cam.background = vec3(0, 0, 0);
  cam.vfov = 40;
  cam.lookfrom = vec3(278, 278, -800);
  cam.lookat = vec3(278, 278, 0);
  cam.vup = vec3(0, 1, 0);
  cam.defocus_angle = 0;
}


function scene1(cam) {
  let red = new Lambertian(color(0.65, 0.05, 0.05));
  let white = new Lambertian(color(0.73, 0.73, 0.73));
  let green = new Lambertian(color(0.12, 0.45, 0.15));
  let light = new DiffuseLight(color(15, 15, 15));

  world.add(new Quad(vec3(555, 0, 0), vec3(0, 555, 0), vec3(0, 0, 555), green));
  world.add(new Quad(vec3(0, 0, 0), vec3(0, 555, 0), vec3(0, 0, 555), red));
  world.add(new Quad(vec3(343, 554, 332), vec3(-130, 0, 0), vec3(0, 0, -105), light));
  world.add(new Quad(vec3(0, 0, 0), vec3(555, 0, 0), vec3(0, 0, 555), white));
  world.add(new Quad(vec3(555, 555, 555), vec3(-555, 0, 0), vec3(0, 0, -555), white));
  world.add(new Quad(vec3(0, 0, 555), vec3(555, 0, 0), vec3(0, 555, 0), white));

  let aluminum = new Metal(vec3(0.8, 0.85, 0.88), 0.0);
  
  let box1 = box(vec3(0, 0, 0), vec3(100, 800, 100), aluminum);
  box1.forEach(b => {
    let temp = new RotateY(b, 15);
    temp = new Translate(temp, vec3(265, 0, 295));
    world.add(temp);
  });
  
  let glass = new Dielectric(1.5);
  world.add(new Sphere(new Ray(vec3(190, 90, 190), vec3(0, 0, 0)), 90, glass));
  lights.add(new Quad(vec3(343, 554, 332), vec3(-130, 0, 0), vec3(0, 0, -105), null));

  cam.sample_per_pixel = 4;
  cam.max_depth = 4;
  cam.background = vec3(0, 0, 0);
  cam.vfov = 40;
  cam.lookfrom = vec3(278, 278, -800);
  cam.lookat = vec3(278, 278, 0);
  cam.vup = vec3(0, 1, 0);
  cam.defocus_angle = 0;
}
