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
    this.diffusion = diffusion;
    this.viscosity = viscosity;

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





// --- main --- //

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  const SIZE = 128;
  const SIM_SPEED = 1;
  const fluid = new Fluid(SIZE, 0.0, 0.0, 0.0);

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

      // 加入密度
      fluid.addDensity(gridX, gridY, 100);

      // 計算滑鼠移動方向並施加力
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