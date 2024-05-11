class Polygon {
  constructor(vertexes) {
    this.vertexes = vertexes;
  }

  draw(ctx, { stroke = "black", fill = "rgba(0, 0, 0, 0.5)", lineWidth = 2 } = {}) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;

    ctx.moveTo(this.vertexes[0].x, this.vertexes[0].y);
    for (let i=0; i<this.vertexes.length; i++) {
      ctx.lineTo(this.vertexes[i].x, this.vertexes[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}


class Rectangle extends Polygon {
  constructor(x, y, w, h) {
    super([{x: x, y: y}, {x: x+w, y: y}, {x: x+w, y:y+h}, {x:x, y:y+h}]);
  }
}