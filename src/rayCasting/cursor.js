class Cursor {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this._addEventListener();
    this.visible = true;
  }

  _addEventListener() {
    this.canvas.addEventListener("mousemove", event => {
      this.x = Math.min(Math.max(1, event.offsetX), this.canvas.getBoundingClientRect().width-1);
      this.y = Math.min(Math.max(1, event.offsetY), this.canvas.getBoundingClientRect().height-1);
    })
  }


  isInsidePolygon(polygon) {
    let rel = {x: 1000, y: 1000};
    let count = 0;
  
    // for each line segment, check if intersect
    for (let i=0; i<polygon.vertexes.length; i++) {
      if(getIntersection(
        this, 
        rel, 
        polygon.vertexes[i % polygon.vertexes.length], 
        polygon.vertexes[(i+1) % polygon.vertexes.length]
      )) {
        count++;
      };
    }
  
    if (count % 2 == 0) return false
    return true;
  }

  isInsideAnyPolygon(polygons) {
    for (let i=0; i<polygons.length; i++) {
      if (this.isInsidePolygon(polygons[i])) {
        this.visible = false;
        return;
      };
    }
  }

  draw(ctx, polygons) {
    this.visible = true;
    this.isInsideAnyPolygon(polygons);
    drawCircle(ctx, this.x, this.y, 2, "red");
  }
}