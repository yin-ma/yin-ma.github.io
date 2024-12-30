export class TextureManager {
  constructor() {
    this.texture = new Map();
  }

  getTextureByName (name) {
    return this.texture.get(name);
  }

  addTextureByName(name, texture) {
    this.texture.set(name, texture);
  }
}