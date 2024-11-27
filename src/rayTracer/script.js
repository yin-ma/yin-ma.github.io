importScripts("vec3.js");
importScripts("ray.js");

self.onmessage = (msg) => {

  let {canvasWidth, canvasHeight} = msg.data;
  let progress = 0;

  let focal_length = 1.0;
  let viewport_height = 2.0;
  let viewport_width = viewport_height * canvasWidth / canvasHeight;
  let camera_center = Vec3.creatVector(0, 0, 0);
  let viewport_u = Vec3.creatVector(viewport_width, 0, 0);
  let viewport_v = Vec3.creatVector(0, -viewport_height, 0);
  
  let pixel_delta_u = Vec3.scale(viewport_u, 1/canvasWidth);
  let pixel_delta_v = Vec3.scale(viewport_v, 1/canvasHeight);
  
  let viewport_upper_left = Vec3.sub(camera_center, Vec3.creatVector(0, 0, focal_length));
  viewport_upper_left = Vec3.sub(viewport_upper_left, Vec3.scale(viewport_u, 0.5));
  viewport_upper_left = Vec3.sub(viewport_upper_left, Vec3.scale(viewport_v, 0.5));
  
  let pixel00_loc = Vec3.add(viewport_upper_left, Vec3.scale(Vec3.add(pixel_delta_u, pixel_delta_v), 0.5));
  
  
  for (let j=0; j<canvasHeight; j++) {
    progress = (j+1)/canvasHeight*100;
    for (let i=0; i<canvasWidth; i++) {
      let pixel_center = Vec3.add(pixel00_loc, Vec3.add(Vec3.scale(pixel_delta_u, i), Vec3.scale(pixel_delta_v, j)));
      let ray_direction = Vec3.sub(pixel_center, camera_center);
      let r = new Ray(camera_center, ray_direction);
      let color = ray_color(r);
      
      self.postMessage({progress, i, j, color});
    }
  }
}



function hit_sphere(center, radius, r) {
  let oc = Vec3.sub(center, r.origin);
  let a = Vec3.length_squared(r.direction);
  let h = Vec3.dot(r.direction, oc);
  let c = Vec3.length_squared(oc) - radius*radius;

  let discriminant = h*h - a*c;

  if (discriminant < 0) return -1.0;
  return (h - Math.sqrt(discriminant)) / a;
}


function ray_color(r) {
  let t = hit_sphere(Vec3.creatVector(0, 0, -1), 0.5, r);
  if(t > 0) {
    let N = Vec3.normalize(Vec3.sub(r.at(t), Vec3.creatVector(0, 0, -1)));
    return Vec3.scale(Vec3.creatVector(N.x+1, N.y+1, N.z+1), 0.5);
  }

  let unit_direction = Vec3.normalize(r.direction);
  let a = 0.5 * (unit_direction.y + 1.0);
  return Vec3.add(Vec3.scale(Vec3.creatVector(1.0, 1.0, 1.0), 1-a), Vec3.scale(Vec3.creatVector(0.5, 0.7, 1.0), a));
}