class Cube {
  constructor(x, y, z, len=1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.len = len;
    this.planes = [];
    this.init();
  }

  init() {
    let offset = this.len/2;
    // back
    this.planes.push(new Rect3D(
      [this.x + offset, this.y + offset, this.z - offset],
      [this.x - offset, this.y + offset, this.z - offset],
      [this.x - offset, this.y - offset, this.z - offset],
      [this.x + offset, this.y - offset, this.z - offset],
      "orange"
    ));

    // front
    this.planes.push(new Rect3D(
      [this.x - offset, this.y + offset, this.z + offset],
      [this.x + offset, this.y + offset, this.z + offset],
      [this.x + offset, this.y - offset, this.z + offset],
      [this.x - offset, this.y - offset, this.z + offset],
      "red"
    ));

    // top
    this.planes.push(new Rect3D(
      [this.x - offset, this.y + offset, this.z + offset],
      [this.x - offset, this.y + offset, this.z - offset],
      [this.x + offset, this.y + offset, this.z - offset],
      [this.x + offset, this.y + offset, this.z + offset],
      "yellow"
    ));

    // bottom
    this.planes.push(new Rect3D(
      [this.x - offset, this.y - offset, this.z + offset],
      [this.x + offset, this.y - offset, this.z + offset],
      [this.x + offset, this.y - offset, this.z - offset],
      [this.x - offset, this.y - offset, this.z - offset],
      "white"
    ));

    // left
    this.planes.push(new Rect3D(
      [this.x - offset, this.y + offset, this.z - offset],
      [this.x - offset, this.y + offset, this.z + offset],
      [this.x - offset, this.y - offset, this.z + offset],
      [this.x - offset, this.y - offset, this.z - offset],
      "green"
    ));

    // right
    this.planes.push(new Rect3D(
      [this.x + offset, this.y + offset, this.z + offset],
      [this.x + offset, this.y + offset, this.z - offset],
      [this.x + offset, this.y - offset, this.z - offset],
      [this.x + offset, this.y - offset, this.z + offset],
      "blue"
    ));
  }

  draw(ctx, perspectiveMatrix) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    for (let i=0; i<this.planes.length; i++) {
      let ray = vecSubtract(this.planes[i].midPoint, [0, 0, 0]);
      if (dotProduct(this.planes[i].normal, ray) > 0) {
        this.planes[i].draw(ctx, perspectiveMatrix);
      }
    }
  }

  transform(matrix) {
    for (let i=0; i<this.planes.length; i++) {
      this.planes[i].transform(matrix);
    }
    let temp = matVecMul(matrix, [this.x, this.y, this.z, 1]);
    this.x = temp[0];
    this.y = temp[1];
    this.z = temp[2];
  }
}