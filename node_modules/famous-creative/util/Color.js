const step = 255 / 100;

export default class Color {
  // takes values from 0 - 100
  static processGreyscale(color) {
    if (typeof color === 'number') {
      let val = Math.round(step * color).toString(16);
      if (val.length === 1) val = `0${val}`;
      return `#${val}${val}${val}`;
    }
    return color;
  }
}
