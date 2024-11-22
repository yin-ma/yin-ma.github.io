export class AABB {
  constructor(x1, x2, y1, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;

    this.activate = true;
  }

  contain(x, y) {
    if (x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2) return true;
    return false; 
  }

  intersect(other) {
    if (this.x1 <= other.x2 && this.x2 >= other.x1 && this.y1 <= other.y2 && this.y2 >= other.y1) return true;
    return false;
  }

  static union(a, b) {
    return new AABB(Math.min(a.x1, b.x1), Math.max(a.x2, b.x2), Math.min(a.y1, b.y1), Math.max(a.y2, b.y2));
  }

  draw(p5) {
    let x = (this.x1 + this.x2) / 2;
    let y = (this.y1 + this.y2) / 2;
    let w = this.x2 - this.x1; 
    let h = this.y2 - this.y1;

    p5.strokeWeight(3);
    if (this.activate) {
      p5.stroke(p5.color(212, 13, 16));
    } else {
      p5.stroke(p5.color(0, 0, 255));
    }
    p5.fill(p5.color(0, 0, 0, 0));
    p5.rect(x, y, w, h);
    p5.stroke(p5.color(0));
    p5.strokeWeight(1);
  }

}