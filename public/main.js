import { grid, GRID_SIZE } from './game/grid.js';
import { drawGrid } from './utils/draw.js';
import { handleCanvasClick } from './utils/events.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const hexSize = 30;
canvas.width = 800;
canvas.height = 600;

canvas.addEventListener('click', handleCanvasClick(grid, hexSize));

function highlightNeighbors(cell) {
  // Reset highlight for all cells
  grid.forEach(cell => cell.highlighted = false);

  // Highlight the clicked cell
  cell.highlighted = true;

  // Get and highlight neighbors
  const neighbors = cell.getNeighbors();
  console.log(`Clicked cell: (${cell.q}, ${cell.r})`);
  neighbors.forEach(neighbor => {
    if (neighbor) {
      neighbor.highlighted = true;
      console.log(`Neighbor: (${neighbor.q}, ${neighbor.r})`);
    }
  });
}

function handleCanvasClick(grid, hexSize) {
  return function (e) {
    const x = e.offsetX;
    const y = e.offsetY;

    const clickedCell = grid.find(cell => {
      const { x: cellX, y: cellY } = hexToPixel(cell.q, cell.r, hexSize, canvas);
      return Math.hypot(x - cellX, y - cellY) < hexSize;
    });

    if (clickedCell) {
      highlightNeighbors(clickedCell);
      drawGrid(ctx, grid, hexSize, canvas);
    }
  };
}

function gameLoop() {
  drawGrid(ctx, grid, hexSize, canvas);
}

function main() {
  // Initial setup or any other initialization logic can go here
  setInterval(gameLoop, 1000);
}

main();