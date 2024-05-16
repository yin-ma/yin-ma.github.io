class Complex {
  constructor(real, img=0) {
    this.real = real;
    this.img = img;
  }
}

function FFT(P) {
  let n = P.length;

  if (n & (n-1) !== 0 || n === 0) {
    throw "array length should be power of 2";
  }
    
  if (n === 1)
    return P;

  let omega = [];
  for (let i=0; i<n; i++) {
    omega.push(new Complex(Math.cos(Math.PI*2*i/n), -Math.sin(Math.PI*2*i/n)));
  }

  let Pe = P.filter((v, i) => (i % 2) === 0 );
  let Po = P.filter((v, i) => (i % 2) === 1 );

  let ye = FFT(Pe);
  let yo = FFT(Po);
  let y = [];

  for (let i=0; i<n; i++) {
    y.push(0);
  }

  for (let i=0; i<n/2; i++) {
    y[i] = add(ye[i], multiply(omega[i], yo[i]));
    y[i+n/2] = subtract(ye[i], multiply(omega[i], yo[i]));
  }
  return y;
}

function iFFT(P) {
  function helper(P) {
    let n = P.length;
  
    if (n & (n-1) !== 0 || n === 0) {
      throw "array length should be power of 2";
    }
      
    if (n === 1)
      return P;
  
    let omega = [];
    for (let i=0; i<n; i++) {
      omega.push(new Complex(Math.cos(Math.PI*2*i/n), Math.sin(Math.PI*2*i/n)));
    }
  
    let Pe = P.filter((v, i) => (i % 2) === 0 );
    let Po = P.filter((v, i) => (i % 2) === 1 );
  
    let ye = helper(Pe);
    let yo = helper(Po);
    let y = [];
  
    for (let i=0; i<n; i++) {
      y.push(0);
    }
  
    for (let i=0; i<n/2; i++) {
      y[i] = add(ye[i], multiply(omega[i], yo[i]));
      y[i+n/2] = subtract(ye[i], multiply(omega[i], yo[i]));
    }
    return y;
  }
  return helper(P).map(v => new Complex(v.real/P.length, v.img/P.length));
}

function add(a, b) {
  return new Complex(a.real + b.real, a.img + b.img);
}

function subtract(a, b) {
  return new Complex(a.real - b.real, a.img - b.img);
}

function multiply(a, b) {
  let realPart = a.real * b.real - a.img * b.img;
  let imgPart = a.real * b.img + a.img * b.real;
  return new Complex(realPart, imgPart);
}

function abs(a) {
  return Math.sqrt(Math.pow(a.real, 2) + Math.pow(a.img, 2));
}

function conjugate(a) {
  return new Complex(a.real, -a.img);
}

function dot(a, b) {
  let sum = 0;
  for (let i=0; i<a.length; i++) {
    sum += a.real * b.real + a.img * b.img;
  }
  return sum
}