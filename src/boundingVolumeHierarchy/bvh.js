import { AABB } from "./aabb.js";
import { Rect } from "./rect.js";


export class BVHNode {
  constructor(aabb, left=null, right=null) {
    this.aabb = aabb;
    this.left = left;
    this.right = right;
  }
}

export class BVH {
  constructor(obj) {
    this.root = this.build(obj);
  }

  build(obj) {
    if (obj.length === 0) return null;

    let aabb = new AABB(obj[0].aabb.x1, obj[0].aabb.x2, obj[0].aabb.y1, obj[0].aabb.y2);

    obj.forEach(element => {
      aabb = AABB.union(aabb, element.aabb);
    });

    if (obj.length === 1) {
      return new BVHNode(aabb, obj[0], null);
    }

    // could use other method to choose axis...
    let axis = 0;

    if ((aabb.x2 - aabb.x1) > (aabb.y2 - aabb.y1)) {
      axis = 0;
    } else {
      axis = 1;
    }

    if (axis === 0) {
      obj.sort((a, b) => a.aabb.x1 - b.aabb.x1);
    } else {
      obj.sort((a, b) => a.aabb.y1 - b.aabb.y1);
    }

    let mid = Math.floor(obj.length / 2);
    let left = this.build(obj.slice(0, mid));
    let right = this.build(obj.slice(mid, obj.length));

    return new BVHNode(aabb, left, right);
  }

  query(node, aabb, result) {
    if (Rect.prototype.isPrototypeOf(node)) {
      if (node.aabb.intersect(aabb)) {
        result.push(node);
      }
      return;
    }

    if (!node.aabb.intersect(aabb)) return;

    if (node.left) {
      this.query(node.left, aabb, result);
    }

    if (node.right) {
      this.query(node.right, aabb, result);
    }
  }
}