export class Cell {
  constructor(i, j, color) {
    this.htmlElement;
    this.i = i;
    this.j = j;
    this.color = color;
    this.id;
    this.movable = true;
    this.init();
  }

  init() {
    this.htmlElement = document.createElement('div');
    this.htmlElement.classList.add('block');
    this.htmlElement.style.setProperty('--x', this.j);
    this.htmlElement.style.setProperty('--y', this.i);
    this.htmlElement.style.setProperty('--block-color', `rgb(${this.color.x}, ${this.color.y}, ${this.color.z}`);
  }

  setPosition(i, j) {
    this.i = i;
    this.j = j;
    this.htmlElement.style.setProperty('--y', this.i);
    this.htmlElement.style.setProperty('--x', this.j);
  }

  moveUp() {
    if(!this.movable) return;
    this.i -= 1;
    this.htmlElement.style.setProperty('--y', this.i);
  }

  moveDown() {
    if(!this.movable) return;
    this.i += 1;
    this.htmlElement.style.setProperty('--y', this.i);
  }

  moveLeft() {
    if(!this.movable) return;
    this.j -= 1;
    this.htmlElement.style.setProperty('--x', this.j);
  }

  moveRight() {
    if(!this.movable) return;
    this.j += 1;
    this.htmlElement.style.setProperty('--x', this.j);
  }

  remove() {
    this.htmlElement.remove();
  }
}