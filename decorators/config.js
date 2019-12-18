const colorsToCss = (prefix, colors) => {
  return Object.keys(colors)
    .map((key) => `--${prefix}-${key}-color: ${colors[key]};`)
    .join("\n");
}

const createHyperColors = (config, colorPalette) => {
  const foreground = config.foregroundColor || colorPalette.lightWhite;
  const background = config.backgroundColor || colorPalette.black;
  const border = config.borderColor || foreground;

  const colors = { foreground, background, border };
  return colorsToCss("hyper", colors);
}

const createHvlColors = (config, colorPalette) => {
  const hvlConfig = config.hyperVscodeLine || {};

  const foreground = hvlConfig.foregroundColor || config.foregroundColor || colorPalette.lightWhite;
  const background = hvlConfig.backgroundColor || config.backgroundColor || colorPalette.black;
  const dirty = hvlConfig.dirtyColor || colorPalette.lightYellow;
  const ahead = hvlConfig.aheadColor || colorPalette.blue;

  const colors = { foreground, background, dirty, ahead };
  return colorsToCss("hvl", colors);
}

module.exports = (config) => {
  const colorPalette = Object.assign({
    black: "#000000",
    red: "#ff0000",
    green: "#33ff00",
    yellow: "#ffff00",
    blue: "#0066ff",
    magenta: "#cc00ff",
    cyan: "#00ffff",
    white: "#d0d0d0",
    lightBlack: "#808080",
    lightRed: "#ff0000",
    lightGreen: "#33ff00",
    lightYellow: "#ffff00",
    lightBlue: "#0066ff",
    lightMagenta: "#cc00ff",
    lightCyan: "#00ffff",
    lightWhite: "#ffffff"
  }, config.colors);

  return Object.assign({}, config, {
    css: `
      :global(:root) { ${createHyperColors(config, colorPalette)} }
      :global(:root) { ${createHvlColors(config, colorPalette)} }
      ${config.css || ''}
    `
  });
};