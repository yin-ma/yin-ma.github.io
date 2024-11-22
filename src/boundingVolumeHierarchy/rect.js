import { AABB } from "./aabb.js";

export class Rect{
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;

    this.velx = 0;
    this.vely = 0;

    this.aabb = new AABB(x-w/2, x+w/2, y-h/2, y+h/2);
  }

  update() {
    this.x += this.velx;
    this.y += this.vely;

    this.aabb.x1 += this.velx;
    this.aabb.x2 += this.velx;
    this.aabb.y1 += this.vely;
    this.aabb.y2 += this.vely;
  }

  draw(p5) {
    p5.fill(this.color);
    p5.rect(this.x, this.y, this.w, this.h);
    this.aabb.draw(p5);
  }
}