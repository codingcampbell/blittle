export default class Huerizon {
  constructor(screen) {
    this.screen = screen;
  }

  onTouch(x, y) {}

  onMove(x, y) {}

  update(time) {
    let x, y;
    let tx = Math.sin(time * 0.0002) * 20;
    let ty = Math.cos(time * 0.0002) * -20;

    for (y = 0; y < this.screen.height; y += 1) {
      for (x = 0; x < this.screen.width; x += 1) {
        this.screen.setPixel(
          x,
          y,
          128 + Math.sin(time * 0.00125 + ((tx + x - this.screen.width / 2) / ((ty + y) - this.screen.height / 2))) * 128,
          128 + Math.sin(-time * 0.001 + ((tx + x - this.screen.width / 2) / ((ty + y) - this.screen.height / 2))) * 128,
          128 + Math.sin(-time * 0.0015 + ((tx + x - this.screen.width / 2) / ((ty + y) - this.screen.height / 2))) * 128
        );
      }
    }
  }
}
