class CameraFactory {
  static get(setting) {
    let cam = new Camera(parseFloat(setting["width"]), parseFloat(setting["height"]));

    cam.defocus_angle = parseFloat(setting["defocusAngle"]);
    cam.lookat = vec3(parseFloat(setting["dx"]), parseFloat(setting["dy"]), parseFloat(setting["dz"]));
    cam.focus_dist = parseFloat(setting["focusDist"]);
    cam.max_depth = parseFloat(setting["maxDepth"]);
    cam.sample_per_pixel = parseFloat(setting["samplePerPixel"]);
    cam.vfov = parseFloat(setting["vfov"]);
    cam.lookfrom = vec3(parseFloat(setting["x"]), parseFloat(setting["y"]), parseFloat(setting["z"]));
    cam.background = vec3(parseFloat(setting["r"]), parseFloat(setting["g"]), parseFloat(setting["b"]));

    return cam;
  }
}


class QuadFactory {
  static get(setting) {
    if (parseFloat(setting["angle"]) === 0) {
      let Q = vec3(parseFloat(setting["x"]), parseFloat(setting["y"]), parseFloat(setting["z"]));
      let u = vec3(parseFloat(setting["ux"]), parseFloat(setting["uy"]), parseFloat(setting["uz"]));
      let v = vec3(parseFloat(setting["vx"]), parseFloat(setting["vy"]), parseFloat(setting["vz"]));
      let mat = MaterialFactory.getMaterial(setting);
      return new Quad(Q, u, v, mat);
    } else {
      let Q = vec3(0, 0, 0);
      let u = vec3(parseFloat(setting["ux"]), parseFloat(setting["uy"]), parseFloat(setting["uz"]));
      let v = vec3(parseFloat(setting["vx"]), parseFloat(setting["vy"]), parseFloat(setting["vz"]));
      let mat = MaterialFactory.getMaterial(setting);
      let res = new Quad(Q, u, v, mat);
      res = new RotateY(res, parseFloat(setting["angle"]));
      res = new Translate(res, vec3(parseFloat(setting["x"]), parseFloat(setting["y"]), parseFloat(setting["z"])));
      return res;
    }
  }

  static add(primitive, world, lights) {
    if (!primitive instanceof Quad) return;
    world.add(primitive);

    if (primitive.mat instanceof DiffuseLight) {
      lights.add(primitive);
    }
  }
}


class SphereFactory {
  static get(setting) {
    let center = vec3(parseFloat(setting["x"]), parseFloat(setting["y"]), parseFloat(setting["z"]));
    let radius = parseFloat(setting["radius"]);
    let mat = MaterialFactory.getMaterial(setting);
    return new Sphere(new Ray(center, vec3(0, 0, 0)), radius, mat);
  }

  static add(primitive, world, lights) {
    if (!primitive instanceof Sphere) return;
    world.add(primitive);

    if (primitive.mat instanceof DiffuseLight) {
      lights.add(primitive);
    }
  }
}


class BoxFactory {
  static get(setting) {
    if (parseFloat(setting["angle"]) === 0) {
      let center = vec3(parseFloat(setting["x"]), parseFloat(setting["y"]), parseFloat(setting["z"]));
      let size = vec3(parseFloat(setting["sizeX"]), parseFloat(setting["sizeY"]), parseFloat(setting["sizeZ"]));
      let mat = MaterialFactory.getMaterial(setting);
      return box(center, size, mat);
    }

    else {
      let center = vec3(0, 0, 0);
      let size = vec3(parseFloat(setting["sizeX"]), parseFloat(setting["sizeY"]), parseFloat(setting["sizeZ"]));
      let mat = MaterialFactory.getMaterial(setting);
      let res = box(center, size, mat);

      res = res.map(b => {
        let temp = new RotateY(b, parseFloat(setting["angle"]));
        temp = new Translate(temp, vec3(parseFloat(setting["x"]), parseFloat(setting["y"]), parseFloat(setting["z"])));
        return temp;
      })

      return res;
    }
  }

  static add(primitive, world, lights) {
    if (!primitive instanceof Box) return;
    primitive.forEach(b => {
      world.add(b);
      if (b.mat instanceof DiffuseLight) {
        lights.add(b);
      }
    });
  }
}


class TriangleFactory {
  static get(setting) {
    if (parseFloat(setting["angle"]) === 0) {
      let Q = vec3(parseFloat(setting["x"]), parseFloat(setting["y"]), parseFloat(setting["z"]));
      let u = vec3(parseFloat(setting["ux"]), parseFloat(setting["uy"]), parseFloat(setting["uz"]));
      let v = vec3(parseFloat(setting["vx"]), parseFloat(setting["vy"]), parseFloat(setting["vz"]));
      let mat = MaterialFactory.getMaterial(setting);
      return new Triangle(Q, u, v, mat);
    } else {
      let Q = vec3(0, 0, 0);
      let u = vec3(parseFloat(setting["ux"]), parseFloat(setting["uy"]), parseFloat(setting["uz"]));
      let v = vec3(parseFloat(setting["vx"]), parseFloat(setting["vy"]), parseFloat(setting["vz"]));
      let mat = MaterialFactory.getMaterial(setting);
      let res = new Triangle(Q, u, v, mat);
      res = new RotateY(res, parseFloat(setting["angle"]));
      res = new Translate(res, vec3(parseFloat(setting["x"]), parseFloat(setting["y"]), parseFloat(setting["z"])));
      return res;
    }
  }

  static add(primitive, world, lights) {
    if (!primitive instanceof Triangle) return;
    world.add(primitive);

    if (primitive.mat instanceof DiffuseLight) {
      lights.add(primitive);
    }
  }
}


class MaterialFactory {
  static getMaterial(setting) {
    switch (setting["material"]) {
      case "lambertian":
        return new Lambertian(vec3(parseFloat(setting["lambertianR"]), parseFloat(setting["lambertianG"]), parseFloat(setting["lambertianB"])));
      case "isotropic":
        return new Isotropic(vec3(parseFloat(setting["isotropicR"]), parseFloat(setting["isotropicG"]), parseFloat(setting["isotropicB"])));
      case "metal":
        return new Metal(vec3(parseFloat(setting["metalR"]), parseFloat(setting["metalG"]), parseFloat(setting["metalB"])), parseFloat(setting["fuzz"]));
      case "dielectric":
        return new Dielectric(parseFloat(setting["refractionIndex"]));
      case "light":
        return new DiffuseLight(vec3(parseFloat(setting["lightR"]), parseFloat(setting["lightG"]), parseFloat(setting["lightB"])));
      default:
        break;
    }
  }
}