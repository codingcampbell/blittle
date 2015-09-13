import * as util from './util';
import * as color from './color';

const createCanvas = (width, height) => {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const _fillRect = function(x, y, w, h, scanline, color, imageData) {
  var rx, ry, index;
  for (ry = 0; ry < h; ry += 1) {
    for (rx = 0; rx < w; rx += 1) {
      index = ((y + ry) * scanline + (x + rx)) * 4;
      imageData.data[index] = color[0];
      imageData.data[index + 1] = color[1];
      imageData.data[index + 2] = color[2];
      imageData.data[index + 3] = color[3];
    }
  }
}

export default class Screen {
  constructor(width, height) {
    this.width = width || 128;
    this.height = height || Math.floor(this.width / (4 / 3));
    this.scale = 1;
    this.padding = 0;

    this.canvas = createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext('2d');

    this.pixels = this.ctx.createImageData(this.width, this.height);
    this.scaledPixels = this.ctx.createImageData(this.width, this.height);

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.setRGBA(x, y, 0x000000ff);
      }
    }
  }

  appendTo(dom) {
    dom.appendChild(this.canvas);
  }

  setRGBA(x, y, rgba) {
    return this.setPixel.apply(this, [x, y].concat(color.RGBA(rgba)));
  }

  setRGB(x, y, rgb) {
    return this.setPixel.apply(this, [x, y].concat(color.RGB(rgb)));
  }

  setHSLA(x, y, h, s, l, a) {
    return this.setPixel.apply(this, [x, y].concat(color.HSLA(h, s, l, a)));
  }

  setHSL(x, y, h, s, l) {
    return this.setPixel.apply(this, [x, y].concat(color.HSL(h, s, l)));
  }

  setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= this.width  || y < 0 || y >= this.height) {
      return;
    }

    const index = (y * this.width + x) * 4;
    this.pixels.data[index + 0] = Math.floor(r);
    this.pixels.data[index + 1] = Math.floor(g);
    this.pixels.data[index + 2] = Math.floor(b);
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

  // Same as getPixel, except alpha is mapped from 0-255 to 0-1 (for use in rgba() CSS-style syntax)
  getCanvasPixel(x, y) {
    const index = (y * this.width + x) * 4;
    return [
      this.pixels.data[index + 0],
      this.pixels.data[index + 1],
      this.pixels.data[index + 2],
      this.pixels.data[index + 3] / 255,
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
    this.scaledPixels = this.ctx.createImageData(this.canvas.width, this.canvas.height);
  }

  render() {
    let y, x, rx, ry;

    for (y = 0; y < this.height; y += 1) {
      for (x = 0; x < this.width; x += 1) {
        _fillRect(Math.floor(x * this.scale + x * this.padding), Math.floor(y * this.scale + y * this.padding), this.scale, this.scale, this.canvas.width, this.getPixel(x, y), this.scaledPixels);
      }
    }

    this.ctx.putImageData(this.scaledPixels, 0, 0);
  }
}
