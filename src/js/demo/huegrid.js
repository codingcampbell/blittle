import * as util from '../util';

export default class Huegrid {
  constructor(screen) {
    this.screen = screen;
  }

  update(time) {
    let x, y;
    let tx = Math.sin(time * 0.0002) * 2;
    let ty = Math.cos(time * 0.0002) * -2;

    for (y = 0; y < this.screen.height; y += 1) {
      for (x = 0; x < this.screen.width; x += 1) {
        this.screen.setHSL(
          x,
          y,
          util.normalizeNegative(Math.sin(time * 0.001 + (tx * x + ty * y) * 0.005)),
          1,
          util.normalizeNegative(Math.sin(time * 0.001 + ((tx + x) * (ty + y) * 0.5))) * 0.6
        );
      }
    }
  }
}
