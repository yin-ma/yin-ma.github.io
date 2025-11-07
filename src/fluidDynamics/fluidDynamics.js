/**
 * real time fluid dynamics for games
 * https://graphics.cs.cmu.edu/nsp/course/15-464/Fall09/papers/StamFluidforGames.pdf
 * 
 */


const IX = (x, y, N) => Math.max(0, Math.min(N-1, x)) + Math.max(0, Math.min(N-1, y)) * N;

class Fluid{
  constructor(size, diffusion, viscosity, dt) {
    this.size = size;
    this.dt = dt;
    this.diff = diffusion;
    this.visc = viscosity;

    const N = this.size;
    const arraySize = N * N;

    // init arrays
    this.density = new Float32Array(arraySize).fill(0);
    this.density0 = new Float32Array(arraySize).fill(0);

    this.Vx = new Float32Array(arraySize).fill(0);
    this.Vy = new Float32Array(arraySize).fill(0);
    this.Vx0 = new Float32Array(arraySize).fill(0);
    this.Vy0 = new Float32Array(arraySize).fill(0);

  }

  addDensity(x, y, amount) {
    this.density[IX(x, y, this.size)] += amount;
  }

  addVelocity(x, y, amountX, amountY) {
    this.Vx[IX(x, y, this.size)] += amountX;
    this.Vy[IX(x, y, this.size)] += amountY;
  }

  step() {
    const N = this.size;
    const visc = this.visc;
    const diff = this.diff;
    const dt = this.dt;

    diffuse(1, this.Vx0, this.Vx, visc, dt, 4, N);
    diffuse(2, this.Vy0, this.Vy, visc, dt, 4, N);

    project(this.Vx0, this.Vy0, this.Vx, this.Vy, 4, N);

    advect(1, this.Vx, this.Vx0, this.Vx0, this.Vy0, dt, N);
    advect(2, this.Vy, this.Vy0, this.Vx0, this.Vy0, dt, N);

    project(this.Vx, this.Vy, this.Vx0, this.Vy0, 4, N);

    diffuse(0, this.density0, this.density, diff, dt, 4, N);
    advect(0, this.density, this.density0, this.Vx, this.Vy, dt, N);

  }

  render(ctx) {

    const N = this.size;
    const cellWidth = ctx.canvas.width / N;
    const cellHeight = ctx.canvas.height / N;

    for (let j=0; j < N; j++) {
      for (let i=0; i < N; i++) {
        const d = this.density[IX(i, j, N)];
        const c = Math.min(255, Math.max(0, d*255));
        ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
        ctx.fillRect(i*cellWidth, j*cellHeight, cellWidth, cellHeight);
      }
    }
  }
}



function set_bnd(b, x, N) {
  for (let i = 1; i < N - 1; i++) {
    x[IX(i, 0, N)] = b === 2 ? -x[IX(i, 1, N)] : x[IX(i, 1, N)];
    x[IX(i, N - 1, N)] = b === 2 ? -x[IX(i, N - 2, N)] : x[IX(i, N - 2, N)];
  }

  for (let j = 1; j < N - 1; j++) {
    x[IX(0, j, N)] = b === 1 ? -x[IX(1, j, N)] : x[IX(1, j, N)];
    x[IX(N - 1, j, N)] = b === 1 ? -x[IX(N - 2, j, N)] : x[IX(N - 2, j, N)];
  }

  x[IX(0, 0, N)] = 0.5 * (x[IX(1, 0, N)] + x[IX(0, 1, N)]);
  x[IX(0, N - 1, N)] = 0.5 * (x[IX(1, N - 1, N)] + x[IX(0, N - 2, N)]);
  x[IX(N - 1, 0, N)] = 0.5 * (x[IX(N - 2, 0, N)] + x[IX(N - 1, 1, N)]);
  x[IX(N - 1, N - 1, N)] = 0.5 * (x[IX(N - 2, N - 1, N)] + x[IX(N - 1, N - 2, N)]);
}


function diffuse(b, x, x0, diff, dt, iter, N) {
  /**
   * diffusion equation:
   * df/dt = αΔf
   * 
   * 
   * df/dt = (f - f0)/dt                      (Backward Difference)
   * let s = fᵢ₋₁ⱼ + fᵢ₊₁ⱼ + fᵢⱼ₋₁ + fᵢⱼ₊₁
   * Δf = (s - 4f)/(h**2)                     (Numerical Methods of Laplacian)
   * 
   * i.e.
   * let k = α * dt / h**2
   * (f - f0)/dt = α(s - 4f)/(h**2)
   * f = (f0 + ks) / (1+4k)                   (final formula)
   * 
   */
  const a = dt * diff * N * N;

  for (let k=0; k < iter; k++) {  // Gauss–Seidel method
    for (let j=1; j < N-1; j++) {
      for (let i=1; i < N-1; i++) {
        x[IX(i, j, N)] = (x0[IX(i, j, N)] + a*(x[IX(i + 1, j, N)] + x[IX(i - 1, j, N)] + x[IX(i, j + 1, N)] + x[IX(i, j - 1, N)])) / (1+4*a)
      }
    }

    set_bnd(b, x, N);
  }
}

function advect(b, d, d0, velocX, velocY, dt, N) {
  /**
   * Bilinear interpolation:
   * f(x,y) = f(0,0)(1-x)(1-y) + f(0,1)(1-x)(1-y)+f(1,0)x(1-y)+f(1,1)xy
   */

  const dtx = dt * N;
  const dty = dt * N;

  for (let j=1; j < N-1; j++) {
    for (let i=1; i < N-1; i++) {
      let x = i - dtx * velocX[IX(i, j, N)];
      let y = j - dty * velocY[IX(i, j, N)];

      if (x < 0.5) x = 0.5; if (x > N - 1.5) x = N - 1.5;
      if (y < 0.5) y = 0.5; if (y > N - 1.5) y = N - 1.5;

      const i0 = Math.floor(x);
      const i1 = i0 + 1;
      const j0 = Math.floor(y);
      const j1 = j0 + 1;

      const s1 = x - i0;
      const s0 = 1 - s1;
      const t1 = y - j0;
      const t0 = 1 - t1;

      d[IX(i, j, N)] = s0 * (t0 * d0[IX(i0, j0, N)] + t1 * d0[IX(i0, j1, N)]) +
                 s1 * (t0 * d0[IX(i1, j0, N)] + t1 * d0[IX(i1, j1, N)]);

    }
  }

  set_bnd(b, d, N);
}

function project(velocX, velocY, p, div, iter, N) {
  /**
   * helmholtz decomposition:
   * F = -∇φ + ∇ x A
   * 
   * take div on both sides:
   * ∇．F = -∇²φ       (div (∇ x A) = 0)
   * 
   * where:
   * ∇．F = dF/dx + dF/dy
   * dF/dx = (Fx(i+1,j)-Fx(i-1,j))/2h
   * dF/dy = (Fy(i,j+1)-Fy(i,j-1))/2h
   * 
   * => solve φ
   * lhs = [Fx(i+1,j)-Fx(i-1,j)+Fy(i,j+1)-Fy(i,j-1)]/2h
   * rhs = [φ(i+1,j)+φ(i-1,j)+φ(i,j+1)+φ(i,j-1)-4φ(i,j)]/h²
   * φ(i,j) = (1/4)*{-[Fx(i+1,j)-Fx(i-1,j)+Fy(i,j+1)-Fy(i,j-1)]*(h/2) + φ(i+1,j)+φ(i-1,j)+φ(i,j+1)+φ(i,j-1)}
   * 
   * final result:
   * ∇ x A = F + ∇φ
   * where ∇ x A is div free
   */


  // compute -[Fx(i+1,j)-Fx(i-1,j)+Fy(i,j+1)-Fy(i,j-1)]*(h/2)
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      div[IX(i, j, N)] = -(0.5/N) * (
        velocX[IX(i + 1, j, N)] - velocX[IX(i - 1, j, N)] +
        velocY[IX(i, j + 1, N)] - velocY[IX(i, j - 1, N)]
        );
      p[IX(i, j, N)] = 0;
    }
  }
  set_bnd(0, div, N);
  set_bnd(0, p, N);


  // compute φ(i,j) = (1/4)*{-[Fx(i+1,j)-Fx(i-1,j)+Fy(i,j+1)-Fy(i,j-1)]*(h/2) + φ(i+1,j)+φ(i-1,j)+φ(i,j+1)+φ(i,j-1)}
  // Gauss–Seidel method
  for (let k = 0; k < iter; k++) {
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        p[IX(i, j, N)] = (div[IX(i, j, N)] + p[IX(i + 1, j, N)] + p[IX(i - 1, j, N)] + p[IX(i, j + 1, N)] + p[IX(i, j - 1, N)]) / 4;
      }
    }
    set_bnd(0, p, N);
  }

  
  // compute ∇ x A = F + ∇φ
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      velocX[IX(i, j, N)] -= 0.5 * (p[IX(i + 1, j, N)] - p[IX(i - 1, j, N)]) * N;
      velocY[IX(i, j, N)] -= 0.5 * (p[IX(i, j + 1, N)] - p[IX(i, j - 1, N)]) * N;
    }
  }
  set_bnd(1, velocX, N);
  set_bnd(2, velocY, N);

}




// --- main --- //

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  const SIZE = 128;
  const SIM_SPEED = 1;
  const fluid = new Fluid(SIZE, 0.000001, 0.0000001, 0.1);

  let lastMousePos = { x: 0, y: 0 };
  let isMouseDown = false;

  canvas.addEventListener('mousedown', e => {
    isMouseDown = true;
    lastMousePos = { x: e.offsetX, y: e.offsetY };
  });

  canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  canvas.addEventListener('mousemove', e => {
    if (isMouseDown) {
      const { offsetX, offsetY } = e;
      const gridX = Math.floor(offsetX / canvas.width * SIZE);
      const gridY = Math.floor(offsetY / canvas.height * SIZE);

      fluid.addDensity(gridX, gridY, 100);

      const dx = offsetX - lastMousePos.x;
      const dy = offsetY - lastMousePos.y;
      fluid.addVelocity(gridX, gridY, dx * 0.1, dy * 0.1);

      lastMousePos = { x: offsetX, y: offsetY };
    }
  });


  
  function animate() {

    for(let i = 0; i < SIM_SPEED; i++) {
      fluid.step();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fluid.render(ctx);

    requestAnimationFrame(animate);
  }

  animate();

})