export function readConfig(context, config) {
  context.lineWidth = config.lineWidth;
  context.lineCap = config.lineCap;
  context.fillStyle = config.pencilColor;
  context.strokeStyle = config.pencilColor;
}

const config = {
  blankColor: '#fff',
  pencilColor: '#000',
  lineWidth: 1,
  lineCap: 'round',
}

export default config;
