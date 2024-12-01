function getQuadLayout() {
  return {
    "type": "quad",
    "name": "quad",
    "x": "0",
    "y": "0",
    "z": "0",
    "ux": "1",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "1",
    "vz": "0",
    "angle": "0",
    "material": "lambertian"
  }
}

function getSphereLayout() {
  return {
    "type": "sphere",
    "name": "sphere",
    "x": "0",
    "y": "0",
    "z": "0",
    "radius": "1",
    "material": "lambertian"
  }
}

function getBoxLayout() {
  return {
    "type": "box",
    "name": "box",
    "x": "0",
    "y": "0",
    "z": "0",
    "sizeX": "1",
    "sizeY": "1",
    "sizeZ": "1",
    "angle": "0",
    "material": "lambertian"
  }
}

function getTriangleLayout() {
  return {
    "type": "triangle",
    "name": "triangle",
    "x": "0",
    "y": "0",
    "z": "0",
    "ux": "1",
    "uy": "-1",
    "uz": "0",
    "vx": "-1",
    "vy": "-1",
    "vz": "0",
    "angle": "0",
    "material": "lambertian"
  }
}


function getCornellBox() {
  let cam = {
    "type": "camera",
    "width": "400",
    "height": "300",
    "x": "278",
    "y": "278",
    "z": "-800",
    "dx": "278",
    "dy": "278",
    "dz": "0",
    "r": "0",
    "g": "0",
    "b": "0",
    "samplePerPixel": "8",
    "maxDepth": "8",
    "vfov": "40",
    "defocusAngle": "0",
    "focusDist": "10"
  }

  let leftWall = {
    "type": "quad",
    "name": "leftwall",
    "x": "555",
    "y": "0",
    "z": "0",
    "ux": "0",
    "uy": "555",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "555",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.12",
    "lambertianG": "0.45",
    "lambertianB": "0.15",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let rightWall = {
    "type": "quad",
    "name": "rightwall",
    "x": "0",
    "y": "0",
    "z": "0",
    "ux": "0",
    "uy": "555",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "555",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.65",
    "lambertianG": "0.05",
    "lambertianB": "0.05",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let ground = {
    "type": "quad",
    "name": "ground",
    "x": "0",
    "y": "0",
    "z": "0",
    "ux": "555",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "555",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.73",
    "lambertianG": "0.73",
    "lambertianB": "0.73",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let ceiling = {
    "type": "quad",
    "name": "ceiling",
    "x": "0",
    "y": "0",
    "z": "555",
    "ux": "555",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "555",
    "vz": "0",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.73",
    "lambertianG": "0.73",
    "lambertianB": "0.73",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let backwall = {
    "type": "quad",
    "name": "backwall",
    "x": "555",
    "y": "555",
    "z": "555",
    "ux": "-555",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "-555",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.73",
    "lambertianG": "0.73",
    "lambertianB": "0.73",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let topLight = {
    "type": "quad",
    "name": "toplight",
    "x": "343",
    "y": "554",
    "z": "332",
    "ux": "-130",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "-105",
    "angle": "0",
    "material": "light",
    "lambertianR": "0.73",
    "lambertianG": "0.73",
    "lambertianB": "0.73",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "15",
    "lightG": "15",
    "lightB": "15"
  }

  let leftBox = {
    "type": "box",
    "name": "leftbox",
    "x": "265",
    "y": "0",
    "z": "295",
    "sizeX": "165",
    "sizeY": "330",
    "sizeZ": "165",
    "angle": "15",
    "material": "metal",
    "lambertianR": "0.75",
    "lambertianG": "0.75",
    "lambertianB": "0.75",
    "isotropicR": "0.75",
    "isotropicG": "0.75",
    "isotropicB": "0.75",
    "metalR": "0.8",
    "metalG": "0.85",
    "metalB": "0.88",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let rightBall = {
    "type": "sphere",
    "name": "rightball",
    "x": "190",
    "y": "90",
    "z": "190",
    "radius": "90",
    "material": "dielectric",
    "lambertianR": "0.15",
    "lambertianG": "0.45",
    "lambertianB": "0.15",
    "isotropicR": "0.15",
    "isotropicG": "0.45",
    "isotropicB": "0.15",
    "metalR": "0.15",
    "metalG": "0.45",
    "metalB": "0.15",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  return [cam, topLight, leftWall, rightWall, ground, ceiling, backwall, leftBox, rightBall];
}



function getMarblesWorld() {
  let res = []

  let cam = {
    "type": "camera",
    "width": "200",
    "height": "150",
    "x": "13",
    "y": "2",
    "z": "3",
    "dx": "0",
    "dy": "0",
    "dz": "0",
    "r": "0.5",
    "g": "0.7",
    "b": "1.0",
    "samplePerPixel": "8",
    "maxDepth": "8",
    "vfov": "20",
    "defocusAngle": "0.6",
    "focusDist": "10"
  }

  res.push(cam);

  let ground = {
    "type": "sphere",
    "name": "ground",
    "x": "0",
    "y": "-1000",
    "z": "0",
    "radius": "1000",
    "material": "lambertian",
    "lambertianR": "0.5",
    "lambertianG": "0.5",
    "lambertianB": "0.5",
    "isotropicR": "0.15",
    "isotropicG": "0.45",
    "isotropicB": "0.15",
    "metalR": "0.15",
    "metalG": "0.45",
    "metalB": "0.15",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "500",
    "lightG": "500",
    "lightB": "500"
  }

  res.push(ground);

  for (let a=-11; a<11; a++) {
    for (let b=-11; b<11; b++) {

      let r1 = Math.random();
      let r2 = Math.random();
      let center = Vec3.creatVector(a + 0.9*r1, 0.2, b + 0.9*r2);

      if (Vec3.length(Vec3.sub(center, vec3(4, 0.2, 0))) > 0.9) {
        let temp = {
          "type": "sphere",
          "name": "marbles",
          "x": `${center.x}`,
          "y": `${center.y}`,
          "z": `${center.z}`,
          "radius": "0.2",
          "material": "lambertian",
          "lambertianR": "0.5",
          "lambertianG": "0.5",
          "lambertianB": "0.5",
          "isotropicR": "0.15",
          "isotropicG": "0.45",
          "isotropicB": "0.15",
          "metalR": "0.15",
          "metalG": "0.45",
          "metalB": "0.15",
          "fuzz": "0",
          "refractionIndex": "1.5",
          "lightR": "500",
          "lightG": "500",
          "lightB": "500"
        }
  
        let choose_mat = Math.random();
        if (choose_mat < 0.8) {
          temp["material"] = "lambertian";
          temp["lambertianR"] = `${Math.random() * Math.random()}`;
          temp["lambertianG"] = `${Math.random() * Math.random()}`;
          temp["lambertianB"] = `${Math.random() * Math.random()}`;
        } else if (choose_mat < 0.95) {
          temp["material"] = "metal";
          temp["metalR"] = `${rand_between(0.5, 1)}`;
          temp["metalG"] = `${rand_between(0.5, 1)}`;
          temp["metalB"] = `${rand_between(0.5, 1)}`;
          temp["fuzz"] = `${rand_between(0, 0.5)}`;
        } else {
          temp["material"] = "dielectric";
        }
  
        res.push(temp);
      }
    }
  }

  let bigBall1 = {
    "type": "sphere",
    "name": "marbles",
    "x": "0",
    "y": "1",
    "z": "0",
    "radius": "1",
    "material": "dielectric",
    "lambertianR": "0.5",
    "lambertianG": "0.5",
    "lambertianB": "0.5",
    "isotropicR": "0.15",
    "isotropicG": "0.45",
    "isotropicB": "0.15",
    "metalR": "0.15",
    "metalG": "0.45",
    "metalB": "0.15",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "500",
    "lightG": "500",
    "lightB": "500"
  }

  let bigBall2 = {
    "type": "sphere",
    "name": "marbles",
    "x": "-4",
    "y": "1",
    "z": "0",
    "radius": "1",
    "material": "lambertian",
    "lambertianR": "0.4",
    "lambertianG": "0.2",
    "lambertianB": "0.1",
    "isotropicR": "0.15",
    "isotropicG": "0.45",
    "isotropicB": "0.15",
    "metalR": "0.15",
    "metalG": "0.45",
    "metalB": "0.15",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "500",
    "lightG": "500",
    "lightB": "500"
  }

  let bigBall3 = {
    "type": "sphere",
    "name": "marbles",
    "x": "4",
    "y": "1",
    "z": "0",
    "radius": "1",
    "material": "metal",
    "lambertianR": "0.4",
    "lambertianG": "0.2",
    "lambertianB": "0.1",
    "isotropicR": "0.15",
    "isotropicG": "0.45",
    "isotropicB": "0.15",
    "metalR": "0.7",
    "metalG": "0.6",
    "metalB": "0.5",
    "fuzz": "0.0",
    "refractionIndex": "1.5",
    "lightR": "500",
    "lightG": "500",
    "lightB": "500"
  }

  res.push(bigBall1);
  res.push(bigBall2);
  res.push(bigBall3);

  return res;
}


function getPyramidWorld() {
  let cam = {
    "type": "camera",
    "width": "400",
    "height": "300",
    "x": "278",
    "y": "278",
    "z": "-800",
    "dx": "278",
    "dy": "278",
    "dz": "0",
    "r": "0",
    "g": "0",
    "b": "0",
    "samplePerPixel": "8",
    "maxDepth": "8",
    "vfov": "40",
    "defocusAngle": "0",
    "focusDist": "10"
  }

  let leftWall = {
    "type": "quad",
    "name": "leftwall",
    "x": "555",
    "y": "0",
    "z": "0",
    "ux": "0",
    "uy": "555",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "555",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.12",
    "lambertianG": "0.45",
    "lambertianB": "0.15",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let rightWall = {
    "type": "quad",
    "name": "rightwall",
    "x": "0",
    "y": "0",
    "z": "0",
    "ux": "0",
    "uy": "555",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "555",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.65",
    "lambertianG": "0.05",
    "lambertianB": "0.05",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let ground = {
    "type": "quad",
    "name": "ground",
    "x": "0",
    "y": "0",
    "z": "0",
    "ux": "555",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "555",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.73",
    "lambertianG": "0.73",
    "lambertianB": "0.73",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let ceiling = {
    "type": "quad",
    "name": "ceiling",
    "x": "0",
    "y": "0",
    "z": "555",
    "ux": "555",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "555",
    "vz": "0",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.73",
    "lambertianG": "0.73",
    "lambertianB": "0.73",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let backwall = {
    "type": "quad",
    "name": "backwall",
    "x": "555",
    "y": "555",
    "z": "555",
    "ux": "-555",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "-555",
    "angle": "0",
    "material": "lambertian",
    "lambertianR": "0.73",
    "lambertianG": "0.73",
    "lambertianB": "0.73",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let topLight = {
    "type": "quad",
    "name": "toplight",
    "x": "343",
    "y": "554",
    "z": "332",
    "ux": "-130",
    "uy": "0",
    "uz": "0",
    "vx": "0",
    "vy": "0",
    "vz": "-105",
    "angle": "0",
    "material": "light",
    "lambertianR": "0.73",
    "lambertianG": "0.73",
    "lambertianB": "0.73",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "15",
    "lightG": "15",
    "lightB": "15"
  }

  let pym = getPyramid(370, 0, 350, 165, 165, 330, 15);
  pym.forEach(t => {
    t["material"] = "lambertian";
    t["lambertianR"] = "0.8";
    t["lambertianG"] = "0.75";
    t["lambertianB"] = "0.18";
  })

  let rightBall = {
    "type": "sphere",
    "name": "rightball",
    "x": "190",
    "y": "90",
    "z": "190",
    "radius": "90",
    "material": "metal",
    "lambertianR": "0.15",
    "lambertianG": "0.45",
    "lambertianB": "0.15",
    "isotropicR": "0.15",
    "isotropicG": "0.45",
    "isotropicB": "0.15",
    "metalR": "0.15",
    "metalG": "0.15",
    "metalB": "0.15",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  return [cam, topLight, leftWall, rightWall, ground, ceiling, backwall, ...pym, rightBall];
}

function getPyramid(x, y, z, w, l, h, ang) {
  let frontTriangle = {
    "type": "triangle",
    "name": "frontTriangle",
    "x": `${x}`,
    "y": `${y+h}`,
    "z": `${z}`,
    "ux": `${w/2}`,
    "uy": `${-h}`,
    "uz": `${-l/2}`,
    "vx": `${-w/2}`,
    "vy": `${-h}`,
    "vz": `${-l/2}`,
    "angle": `${ang}`,
    "material": "lambertian",
    "lambertianR": "0.85",
    "lambertianG": "0.7",
    "lambertianB": "0.16",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let leftTriangle = {
    "type": "triangle",
    "name": "leftTriangle",
    "x": `${x}`,
    "y": `${y+h}`,
    "z": `${z}`,
    "ux": `${-w/2}`,
    "uy": `${-h}`,
    "uz": `${-l/2}`,
    "vx": `${-w/2}`,
    "vy": `${-h}`,
    "vz": `${l/2}`,
    "angle": `${ang}`,
    "material": "lambertian",
    "lambertianR": "0.85",
    "lambertianG": "0.7",
    "lambertianB": "0.16",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let rigthTriangle = {
    "type": "triangle",
    "name": "rightTriangle",
    "x": `${x}`,
    "y": `${y+h}`,
    "z": `${z}`,
    "ux": `${w/2}`,
    "uy": `${-h}`,
    "uz": `${l/2}`,
    "vx": `${w/2}`,
    "vy": `${-h}`,
    "vz": `${-l/2}`,
    "angle": `${ang}`,
    "material": "lambertian",
    "lambertianR": "0.85",
    "lambertianG": "0.7",
    "lambertianB": "0.16",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }

  let backTriangle = {
    "type": "triangle",
    "name": "backTriangle",
    "x": `${x}`,
    "y": `${y+h}`,
    "z": `${z}`,
    "ux": `${-w/2}`,
    "uy": `${-h}`,
    "uz": `${l/2}`,
    "vx": `${w/2}`,
    "vy": `${-h}`,
    "vz": `${l/2}`,
    "angle": `${ang}`,
    "material": "lambertian",
    "lambertianR": "0.85",
    "lambertianG": "0.7",
    "lambertianB": "0.16",
    "isotropicR": "0.73",
    "isotropicG": "0.73",
    "isotropicB": "0.73",
    "metalR": "0.73",
    "metalG": "0.73",
    "metalB": "0.73",
    "fuzz": "0",
    "refractionIndex": "1.5",
    "lightR": "11",
    "lightG": "11",
    "lightB": "11"
  }
  
  return [frontTriangle, leftTriangle, rigthTriangle, backTriangle];
}