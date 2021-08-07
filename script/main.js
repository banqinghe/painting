const canvas = document.getElementById('painting');
const ctx = canvas.getContext('2d');
const blankColor = '#fff';

let isDrawing = false;
let pencilColor = '#000';
let lineWidth = 1;

let startX = null;
let startY = null;

function updateStartCoordinate(x, y) {
  startX = x;
  startY = y;
}

function draw(x, y) {
  if (startX === x && startY === y) {
    ctx.fillRect(x, y, 1, 1);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function handleMouseDown(e) {
  isDrawing = true;
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = pencilColor;
  ctx.beginPath();

  const x = e.offsetX;
  const y = e.offsetY;
  ctx.moveTo(x, y);
  updateStartCoordinate(x, y);
}

function handleMouseMove(e) {
  if (!isDrawing) {
    return;
  }
  draw(e.offsetX, e.offsetY);
}

function handleMouseUp(e) {
  draw(e.offsetX, e.offsetY);
  isDrawing = false;
}

function handleMouseLeave(e) {
  if (isDrawing) {
    draw(e.offsetX, e.offsetY);
  }
  isDrawing = false;
}

function init() {
  ctx.fillStyle = blankColor;
  ctx.imageSmoothingEnabled = false;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mouseleave', handleMouseLeave);
}

function main() {
  init();
}

main();
