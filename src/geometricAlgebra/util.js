class GA {
  constructor(num) {
    this.scalar = num.scalar;
    this.e1 = num.e1;
    this.e2 = num.e2;
    this.e3 = num.e3;
    this.e12 = num.e12;
    this.e23 = num.e23;
    this.e13 = num.e13;
    this.e123 = num.e123;
  }

  static createNum() {
    return new GA({scalar: 0, e1: 0, e2: 0, e3: 0, e12: 0, e23: 0, e13: 0, e123: 0});
  }

  static createVector(x, y, z) {
    return new GA({scalar: 0, e1: x, e2: y, e3: z, e12: 0, e23: 0, e13: 0, e123: 0});
  }

  static createScalar(n) {
    return new GA({scalar: n, e1: 0, e2: 0, e3: 0, e12: 0, e23: 0, e13: 0, e123: 0});
  }

  static add(n1, n2) {
    return new GA({
      scalar: n1.scalar + n2.scalar, 
      e1: n1.e1 + n2.e1, 
      e2: n1.e2 + n2.e2,
      e3: n1.e3 + n2.e3,
      e12: n1.e12 + n2.e12,
      e23: n1.e23 + n2.e23,
      e13: n1.e13 + n2.e13,
      e123: n1.e123 + n2.e123
    });
  }

  add(n2) {
    this.scalar += n2.scalar;
    this.e1 += n2.e1;
    this.e2 += n2.e2;
    this.e3 += n2.e3;
    this.e12 += n2.e12;
    this.e23 += n2.e23;
    this.e13 += n2.e13;
    this.e123 += n2.e123;
  }

  static sub(n1, n2) {
    return new GA({
      scalar: n1.scalar - n2.scalar, 
      e1: n1.e1 - n2.e1, 
      e2: n1.e2 - n2.e2,
      e3: n1.e3 - n2.e3,
      e12: n1.e12 - n2.e12,
      e23: n1.e23 - n2.e23,
      e13: n1.e13 - n2.e13,
      e123: n1.e123 - n2.e123
    });
  }

  sub(n2) {
    this.scalar -= n2.scalar;
    this.e1 -= n2.e1;
    this.e2 -= n2.e2;
    this.e3 -= n2.e3;
    this.e12 -= n2.e12;
    this.e23 -= n2.e23;
    this.e13 -= n2.e13;
    this.e123 -= n2.e123;
  }

  static dot(n1, n2) {
    // this implemetation only include vector/vector dot product
    return n1.e1 * n2.e1 + n1.e2 * n2.e2 + n1.e3 * n2.e3;
  }

  static cross(n1, n2) {
    // this implemetation only include vector/vector cross product
    return new GA({
      scalar: 0, 
      e1: n1.e2*n2.e3 - n1.e3*n2.e2, 
      e2: n1.e3*n2.e1 - n1.e1*n2.e3, 
      e3: n1.e1*n2.e2 - n1.e2*n2.e1,
      e12: 0,
      e23: 0,
      e13: 0,
      e123: 0
    })
  }

  static wedge(n1, n2) {
    // this implemetation only include vector/vector wedge product
    return new GA({
      scalar: 0, 
      e1: 0, 
      e2: 0, 
      e3: 0,
      e12: n1.e1*n2.e2 - n1.e2*n2.e1,
      e23: n1.e2*n2.e3 - n1.e3*n2.e2,
      e13: -n1.e3*n2.e1 + n1.e1*n2.e3,
      e123: 0
    })
  }

  static mult(n1, n2) {
    let res = this.createNum();
    
    // scalar from n1
    res.scalar = n1.scalar * n2.scalar;
    res.e1 = n1.scalar * n2.e1;
    res.e2 = n1.scalar * n2.e2;
    res.e3 = n1.scalar * n2.e3;
    res.e12 = n1.scalar * n2.e12;
    res.e23 = n1.scalar * n2.e23;
    res.e13 = n1.scalar * n2.e13;
    res.e123 = n1.scalar * n2.e123;

    // e1 from n1
    res.scalar += n1.e1 * n2.e1;
    res.e1 += n1.e1 * n2.scalar;
    res.e2 += n1.e1 * n2.e12;
    res.e3 += n1.e1 * n2.e13;
    res.e12 += n1.e1 * n2.e2;
    res.e23 += n1.e1 * n2.e123;
    res.e13 += n1.e1 * n2.e3;
    res.e123 += n1.e1 * n2.e23;

    // e2 from n1
    res.scalar += n1.e2 * n2.e2;
    res.e1 += -n1.e2 * n2.e12;
    res.e2 += n1.e2 * n2.scalar;
    res.e3 += n1.e2 * n2.e23;
    res.e12 += -n1.e2 * n2.e1;
    res.e23 += n1.e2 * n2.e3;
    res.e13 += -n1.e2 * n2.e123;
    res.e123 += -n1.e2 * n2.e13;

    // e3 from n1 
    res.scalar += n1.e3 * n2.e3;
    res.e1 += -n1.e3 * n2.e13;
    res.e2 += -n1.e3 * n2.e23;
    res.e3 += n1.e3 * n2.scalar;
    res.e12 += n1.e3 * n2.e123;
    res.e23 += -n1.e3 * n2.e2;
    res.e13 += -n1.e3 * n2.e1;
    res.e123 += n1.e3 * n2.e12;

    // e12 from n1
    res.scalar += -n1.e12 * n2.e12;
    res.e1 += n1.e12 * n2.e2;
    res.e2 += -n1.e12 * n2.e1;
    res.e3 += -n1.e12 * n2.e123;
    res.e12 += n1.e12 * n2.scalar;
    res.e23 += -n1.e12 * n2.e13;
    res.e13 += n1.e12 * n2.e23;
    res.e123 += n1.e12 * n2.e3;

    // e23 from n1
    res.scalar += -n1.e23 * n2.e23;
    res.e1 += -n1.e23 * n2.e123;
    res.e2 += n1.e23 * n2.e3;
    res.e3 += -n1.e23 * n2.e2;
    res.e12 += n1.e23 * n2.e13;
    res.e23 += n1.e23 * n2.scalar;
    res.e13 += -n1.e23 * n2.e12;
    res.e123 += n1.e23 * n2.e1;

    // e13 from n1
    res.scalar += -n1.e13 * n2.e13;
    res.e1 += n1.e13 * n2.e3;
    res.e2 += n1.e13 * n2.e123;
    res.e3 += -n1.e13 * n2.e1;
    res.e12 += -n1.e13 * n2.e23;
    res.e23 += n1.e13 * n2.e12;
    res.e13 += n1.e13 * n2.scalar;
    res.e123 += -n1.e13 * n2.e2;

    // e123 from n1
    res.scalar += -n1.e123 * n2.e123;
    res.e1 += -n1.e123 * n2.e23;
    res.e2 += n1.e123 * n2.e13;
    res.e3 += -n1.e123 * n2.e12;
    res.e12 += n1.e123 * n2.e3;
    res.e23 += n1.e123 * n2.e1;
    res.e13 += -n1.e123 * n2.e2;
    res.e123 += n1.e123 * n2.scalar;

    return new GA(res);
  }

  static normalize(n) {
    let length1 = Math.sqrt(n.e1*n.e1 + n.e2*n.e2 + n.e3*n.e3);
    let length2 = Math.sqrt(n.e12*n.e12 + n.e23*n.e23 + n.e13*n.e13);

    if (!isNaN(length1) && !isNaN(length2) && length1 !== 0 && length2 !== 0) {
      return new GA({
        scalar: n.scalar, 
        e1: n.e1 / length1, 
        e2: n.e2 / length1,
        e3: n.e3 / length1,
        e12: n.e12 / length2,
        e23: n.e23 / length2,
        e13: n.e13 / length2,
        e123: n.e123
      })
    } else if (!isNaN(length1) && length1 !== 0) {
      return new GA({
        scalar: n.scalar, 
        e1: n.e1 / length1, 
        e2: n.e2 / length1,
        e3: n.e3 / length1,
        e12: 0,
        e23: 0,
        e13: 0,
        e123: n.e123
      })
    } else if (!isNaN(length2) && length2 !== 0) {
      return new GA({
        scalar: n.scalar, 
        e1: 0,
        e2: 0,
        e3: 0,
        e12: n.e12 / length2,
        e23: n.e23 / length2,
        e13: n.e13 / length2,
        e123: n.e123
      })
    }
    else {
      return new GA({
        scalar: n.scalar, 
        e1: 0, 
        e2: 0,
        e3: 0,
        e12: 0,
        e23: 0,
        e13: 0,
        e123: n.e123
    })
    }

  }

  static rotate(n, axis, theta) {
    let norm_axis = GA.normalize(axis);
    let left = GA.createNum();
    let right = GA.createNum();

    let I = GA.createNum();
    I.e123 = 1;

    let unit_bivector = GA.mult(norm_axis, I);
    left.scalar = Math.cos(theta/2);
    left.e12 = -Math.sin(theta/2) * unit_bivector.e12;
    left.e23 = -Math.sin(theta/2) * unit_bivector.e23;
    left.e13 = -Math.sin(theta/2) * unit_bivector.e13;

    right.scalar = Math.cos(theta/2);
    right.e12 = Math.sin(theta/2) * unit_bivector.e12;
    right.e23 = Math.sin(theta/2) * unit_bivector.e23;
    right.e13 = Math.sin(theta/2) * unit_bivector.e13;

    return GA.mult(GA.mult(left, n), right);
    
  }
}