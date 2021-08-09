import { throttle } from './util/optimization.js';
import deepClone from './util/deepClone.js';
import PathList from './path-list/index.js';
import config, { readConfig } from './config/index.js';

const canvas = document.getElementById('painting');
const ctx = canvas.getContext('2d');

const coordinate = document.getElementById('current-coordinate');

/**
 * 绘制操作列表
 * @type {Array<{path: Path2D, type: 'stroke' | 'fill'}>}
 */
const pathList = new PathList();

let isDrawing = false;

let startX = null;
let startY = null;

function updateStartCoordinate(x, y) {
  startX = x;
  startY = y;
}

function beginDraw(x, y) {
  isDrawing = true;
  readConfig(ctx, config);

  pathList.push({
    path: new Path2D(),
    type: 'fill',
    config: deepClone(config),
  });

  pathList.tail().path.moveTo(x, y);
  updateStartCoordinate(x, y);
}

function draw(x, y) {
  const path = pathList.tail().path;
  if (startX === x && startY === y) {
    path.rect(x - config.lineWidth / 2, y - config.lineWidth / 2, config.lineWidth, config.lineWidth);
    ctx.fill(path);
  } else {
    // 画线而非点按的时候也会有 start coordinate == current coordinate 的情况
    // 所以在确定是在划线后要将 type 纠正为 stroke
    if (pathList.tail().type === 'fill') {
      pathList.tail().type = 'stroke';
    }
    path.lineTo(x, y);
    ctx.stroke(path);
  }
}

function handleMouseDown(e) {
  beginDraw(e.offsetX, e.offsetY);
}

function handleMouseMove(e) {
  coordinate.innerText = e.offsetX + ',' +  e.offsetY;
  if (!isDrawing) {
    return;
  }
  draw(e.offsetX, e.offsetY);
}

function handleMouseUp(e) {
  if (isDrawing) {
    draw(e.offsetX, e.offsetY);
  }
  isDrawing = false;
}

function handleMouseEnter(e) {
  // mouseenter 时鼠标左键被按下时，做和 mousedown 相同操作
  if (e.buttons % 2 !== 1) {
    return;
  }
  beginDraw(e.offsetX, e.offsetY);
}

function handleMouseLeave(e) {
  if (isDrawing) {
    draw(e.offsetX, e.offsetY);
  }
  isDrawing = false;
}

function restorePath() {
  pathList.forEach(({path, type, config}) => {
    readConfig(ctx, config);
    if (type === 'stroke') {
      ctx.stroke(path);
    } else {
      ctx.fill(path);
    }
  })
}

function handleWindowResize() {
  canvas.style.display = 'none';
  setTimeout(() => {
    initializeShape();
    initializeBackground();
    restorePath();
  }, 500);
}

function initializeShape() {
  const canvasContainer = window.getComputedStyle(document.getElementById('painting'));
  canvas.style.display = 'block';
  canvas.width = parseInt(canvasContainer.width, 10);
  canvas.height = parseInt(canvasContainer.height, 10);
}

function initializeBackground() {
  ctx.fillStyle = config.blankColor;
  ctx.imageSmoothingEnabled = false;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function initializeListener() {
  window.addEventListener('resize', throttle(handleWindowResize, 400));

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mouseenter', handleMouseEnter);
  canvas.addEventListener('mouseleave', handleMouseLeave);
}

function init() {
  initializeShape();
  initializeBackground();
  initializeListener();
  
}

function main() {
  init();
}

main();
