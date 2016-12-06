import Color from 'color-js';

const NUM_PARTIALS = 10;
const MAX_HUE = 270;

export function numberToColor(num) {
  const hue = 360 - ((num - 1) * MAX_HUE / (NUM_PARTIALS - 1));
  return Color({hue: hue, saturation: 1, value: 1}).toString();
}