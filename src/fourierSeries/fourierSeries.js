class Complex {
  constructor(a, b) {
    this.re = a;
    this.im = b;
  }

  add(c) {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  subtract(c) {
    return new Complex(this.re - c.re, this.im - c.im);
  }

  mult(c) {
    const re = this.re * c.re - this.im * c.im;
    const im = this.re * c.im + this.im * c.re;
    return new Complex(re, im);
  }

  length() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

}


function FFT(P) {
  let n = P.length;

  if (n & (n - 1) !== 0 || n === 0) {
    throw "array length should be power of 2";
  }

  if (n === 1) return P;

  let omega = [];
  for (let i = 0; i < n; i++) {
    omega.push(new Complex(Math.cos(Math.PI * 2 * i / n), -Math.sin(Math.PI * 2 * i / n)));
  }

  let Pe = P.filter((_, i) => (i % 2) === 0);
  let Po = P.filter((_, i) => (i % 2) === 1);

  let ye = FFT(Pe);
  let yo = FFT(Po);
  let y = new Array(n);

  for (let i = 0; i < n / 2; i++) {
    y[i] = ye[i].add(omega[i].mult(yo[i]));
    y[i + n / 2] = ye[i].subtract(omega[i].mult(yo[i]));
  }
  
  return y;
}


function iFFT(P) {
  function helper(P) {
    let n = P.length;

    if (n & (n - 1) !== 0 || n === 0) {
      throw "array length should be power of 2";
    }

    if (n === 1) return P;

    let omega = [];
    for (let i = 0; i < n; i++) {
      omega.push(new Complex(Math.cos(Math.PI * 2 * i / n), Math.sin(Math.PI * 2 * i / n)));
    }

    let Pe = P.filter((_, i) => (i % 2) === 0);
    let Po = P.filter((_, i) => (i % 2) === 1);

    let ye = helper(Pe);
    let yo = helper(Po);
    let y = new Array(n);

    for (let i = 0; i < n / 2; i++) {
      y[i] = ye[i].add(omega[i].mult(yo[i]));
      y[i + n / 2] = ye[i].subtract(omega[i].mult(yo[i]));
    }
    return y;
  }

  return helper(P).map(v => new Complex(v.re / P.length, v.im / P.length));
}
