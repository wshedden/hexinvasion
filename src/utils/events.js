const { getNeighbors } = require('./utils'); // Import the getNeighbors function

function handleMouseEvents(canvas, grid, hexToPixel, drawGrid, hexSize) {
    canvas.addEventListener('mousemove', e => {
        const x = e.offsetX;
        const y = e.offsetY;

        // Find hovered cell
        const hoveredCell = grid.find(cell => {
            const { x: cellX, y: cellY } = hexToPixel(cell.q, cell.r, hexSize, canvas);
            return Math.hypot(x - cellX, y - cellY) < hexSize;
        });

        // Reset highlight for all cells
        grid.forEach(cell => cell.highlighted = false);

        if (hoveredCell) {
            hoveredCell.highlighted = true;
            const neighbors = getNeighbors(hoveredCell.q, hoveredCell.r, grid);
            neighbors.forEach(neighbor => neighbor.highlighted = true);
        }

        drawGrid(); // Redraw the grid to show the highlight
    });
}

module.exports = { handleMouseEvents };
