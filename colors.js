const tome = require("chromotome");
const hexRgb = require("hex-rgb");

let colors = [];

while (colors.length < 6) {
  const palette = tome.getRandom();

  const left = 6 - colors.length;
  colors = [...colors, ...palette.colors.slice(0, left)];
}

console.log(
  colors
    .map(c => {
      const { red, green, blue } = hexRgb(c);

      return `strip.Color(${[red, green, blue]})`;
    })
    .join(`,\n`)
);
