/* Utility functions to derive individual red/green/blue/alpha channels as an array.
* This is the "native" format of the screen, since it has to write individual
* channel values to a Uint8ClampedArray-backed ImageData object.
*
* If you pass these indvidual values to Screen::setPixel, no additional conversion is needed.
*/

export function RGBA(rgba) {
  return [(rgba >> 24) & 0xff, (rgba >> 16) & 0xff, (rgba >> 8) & 0xff, rgba & 0xff];
}

export function RGB(rgb) {
  return [(rgb >> 16) & 0xff, (rgb >> 8) & 0xff, rgb & 0xff, 255];
}

// Conversion code from https://stackoverflow.com/a/9493060
export function HSLA(h, s, l, a) {
  if (s === 0) {
    return [l, l, l, a];
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

  return [convert(h + 1/3) * 255, convert(h) * 255, convert(h - 1/3) * 255, a * 255];
}

export function HSL(h, s, l) {
  return HSLA(h, s, l, 1);
};
