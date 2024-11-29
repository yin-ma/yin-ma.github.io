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