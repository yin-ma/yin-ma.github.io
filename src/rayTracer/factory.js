class CameraFactory {
  static getCamera(setting) {
    let cam = new Camera(parseInt(setting["width"]), parseInt(setting["height"]));

    cam.defocus_angle = parseInt(setting["defocusAngle"]);
    cam.lookat = vec3(parseInt(setting["dx"]), parseInt(setting["dy"]), parseInt(setting["dz"]));
    cam.focus_dist = parseInt(setting["focusDist"]);
    cam.max_depth = parseInt(setting["maxDepth"]);
    cam.sample_per_pixel = parseInt(setting["samplePerPixel"]);
    cam.vfov = parseInt(setting["vfov"]);
    cam.lookfrom = vec3(parseInt(setting["x"]), parseInt(setting["y"]), parseInt(setting["z"]));
    cam.background = vec3(parseInt(setting["r"]), parseInt(setting["g"]), parseInt(setting["b"]));

    return cam;
  }
}


class QuadFactory {
  static getQuad(setting) {
    let Q = vec3(parseInt(setting["x"]), parseInt(setting["y"]), parseInt(setting["z"]));
    let u = vec3(parseInt(setting["ux"]), parseInt(setting["uy"]), parseInt(setting["uz"]));
    let v = vec3(parseInt(setting["vx"]), parseInt(setting["vy"]), parseInt(setting["vz"]));
    let mat = MaterialFactory.getMaterial(setting);
    return new Quad(Q, u, v, mat);
  }
}


class SphereFactory {
  static getSphere(setting) {
    let center = vec3(parseInt(setting["x"]), parseInt(setting["y"]), parseInt(setting["z"]));
    let radius = parseInt(setting["radius"]);
    let mat = MaterialFactory.getMaterial(setting);
    return new Sphere(new Ray(center, vec3(0, 0, 0)), radius, mat);
  }
}


class BoxFactory {
  static getBox(setting) {
    let center = vec3(parseInt(setting["x"]), parseInt(setting["y"]), parseInt(setting["z"]));
    let size = vec3(parseInt(setting["sizeX"]), parseInt(setting["sizeY"]), parseInt(setting["sizeZ"]));
    let mat = MaterialFactory.getMaterial(setting);

    return box(center, size, mat);
  }
}


class TriangleFactory {
  static getTriangle(setting) {
    let Q = vec3(parseInt(setting["x"]), parseInt(setting["y"]), parseInt(setting["z"]));
    let u = vec3(parseInt(setting["ux"]), parseInt(setting["uy"]), parseInt(setting["uz"]));
    let v = vec3(parseInt(setting["vx"]), parseInt(setting["vy"]), parseInt(setting["vz"]));
    let mat = MaterialFactory.getMaterial(setting);
    return new Triangle(Q, u, v, mat);
  }
}


class MaterialFactory {
  static getMaterial(setting) {
    switch (setting["material"]) {
      case "lambertian":
        return new Lambertian(vec3(parseInt(setting["lambertianR"]), parseInt(setting["lambertianG"]), parseInt(setting["lambertianB"])));
      case "isotropic":
        return new Isotropic(vec3(parseInt(setting["isotropicR"]), parseInt(setting["isotropicG"]), parseInt(setting["isotropicB"])));
      case "metal":
        return new Metal(vec3(parseInt(setting["metalR"]), parseInt(setting["metalG"]), parseInt(setting["metalB"])));
      case "dielectric":
        return new Dielectric(parseFloat(setting["refractionIndex"]));
      case "light":
        return new DiffuseLight(vec3(parseInt(setting["lightR"]), parseInt(setting["lightG"]), parseInt(setting["lightB"])));
      default:
        break;
    }
  }
}