import * as util from './util';

const createCanvas = (width, height) => {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

export default class Screen {
  constructor(width, height) {
    this.width = width || 128;
    this.height = height || Math.floor(this.width / (4 / 3));
    this.scale = 1;
    this.padding = 0;

    this.canvas = createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext('2d');

    this.pixels = this.ctx.createImageData(this.width, this.height);

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.setARGB(x, y, 0xff000000);
      }
    }
    this.lastUpdate = null;
  }

  appendTo(dom) {
    dom.appendChild(this.canvas);
  }

  setARGB(x, y, rgba) {
    return this.setPixel(x, y, (rgba >> 16) & 0xff, (rgba >> 8) & 0xff, rgba & 0xff, (rgba >> 24) & 0xff);
  }

  setPixel(x, y, r, g, b, a) {
    const index = (y * this.width + x) * 4;
    this.pixels.data[index + 0] = Math.floor(r);
    this.pixels.data[index + 1] = Math.floor(g);
    this.pixels.data[index + 2] = Math.floor(b);;
    this.pixels.data[index + 3] = Math.floor(typeof a === 'number' ? a : 255);
  }

  getPixel(x, y) {
    const index = (y * this.width + x) * 4;
    return [
      this.pixels.data[index + 0], 
      this.pixels.data[index + 1], 
      this.pixels.data[index + 2], 
      this.pixels.data[index + 3],
    ];
  }

  setScale(scale) {
    this.scale = scale;
    this.resize();
  }

  setPadding(padding) {
    this.padding = padding;
    this.resize();
  }

  resize() {
    this.canvas.width = Math.floor(this.width * this.scale + this.padding * (this.width - 1));
    this.canvas.height = Math.floor(this.height * this.scale + this.padding * (this.height - 1));
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let y, x;

    for (y = 0; y < this.height; y += 1) {
      for (x = 0; x < this.width; x += 1) {
        this.ctx.fillStyle = 'rgba(' + this.getPixel(x, y).join(',') + ')';
        this.ctx.fillRect(Math.floor(x * this.scale + x * this.padding), Math.floor(y * this.scale + y * this.padding), this.scale, this.scale);
      }
    }

    this.ctx.putImageData(this.pixels, 0, 0);
  }
}
