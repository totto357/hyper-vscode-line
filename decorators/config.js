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

  const hvlConfig = config.hyperVscodeLine || {};

  const foreground = hvlConfig.foregroundColor || config.foregroundColor || colorPalette.lightWhite;
  const background = hvlConfig.backgroundColor || config.backgroundColor || colorPalette.black;
  const dirty = hvlConfig.dirtyColor || colorPalette.lightYellow;
  const ahead = hvlConfig.aheadColor || colorPalette.blue;

  const colors = { foreground, background, dirty, ahead };
  const cssColors =
    Object.keys(colors)
      .map((key) => `--hvl-${key}-color: ${colors[key]};`)
      .join("\n");

  return Object.assign({}, config, {
    css: `
      :global(:root) { ${cssColors} }
      ${config.css || ''}
    `
  });
};