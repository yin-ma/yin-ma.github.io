class Rect3D {
  constructor(p1, p2, p3, p4, color="white") {
    this.vertexes = [p1, p2, p3, p4];
    this.color = color;
    this.midPoint = [(p1[0]+p3[0])/2, (p1[1]+p3[1])/2, (p1[2]+p3[2])/2];
    this.normal = crossProduct(vecSubtract(p2, p1), vecSubtract(p3, p2));
  }

  draw(ctx, perspectiveMatrix) {
    let transVertexes = this.vertexes.map(vertex => matVecMul(perspectiveMatrix, [...vertex, 1]));
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(transVertexes[0][0]/transVertexes[0][3]*600, transVertexes[0][1]/transVertexes[0][3]*600);
    for (let i=1; i<this.vertexes.length; i++) {
      ctx.lineTo(transVertexes[i][0]/transVertexes[i][3]*600, transVertexes[i][1]/transVertexes[i][3]*600);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  transform(matrix) {
    this.vertexes = this.vertexes.map(v => {
      let temp = matVecMul(matrix, [...v, 1]);
      return [temp[0], temp[1], temp[2]];
    });

    let temp1 = matVecMul(matrix, [...this.midPoint, 1]);
    this.midPoint = [temp1[0], temp1[1], temp1[2]];

    // note: matrix cannot be scale matrix
    let temp2 = matVecMul(matrix, [...this.normal, 0]);
    this.normal = [temp2[0], temp2[1], temp2[2]];
  }
}