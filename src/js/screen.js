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
        this.setRGBA(x, y, 0x000000ff);
      }
    }
    this.lastUpdate = null;
  }

  appendTo(dom) {
    dom.appendChild(this.canvas);
  }

  setRGBA(x, y, rgba) {
    return this.setPixel(x, y, (rgba >> 24) & 0xff, (rgba >> 16) & 0xff, (rgba >> 8) & 0xff, rgba & 0xff);
  }

  // Conversion code from https://stackoverflow.com/a/9493060
  setHSLA(x, y, h, s, l, a) {
    if (typeof a !== 'number') {
      a = 1;
    }

    if (s === 0) {
      return this.setPixel(x, y, l, l, l, a);
    }


    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    let convert = t => {
      t += t < 0 ? 1 : (t > 1 ? -1 : 0);
      if (t < 1/6) {
        return p + (q - p) * 6 * t;
      }

      if (t < 1/2) {
        return q;
      }

      if (t < 2/3) {
        return p + (q - p) * (2/3 - t) * 6;
      }

      return p;
    };

    let r = convert(h + 1/3);
    let g = convert(h);
    let b = convert(h - 1/3);

    return this.setPixel(x, y, r * 255, g * 255, b * 255, a * 255);
  }

  setPixel(x, y, r, g, b, a) {
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
