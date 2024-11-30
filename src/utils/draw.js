import { getNeighbors } from './utils';

function drawHex(ctx, x, y, size, cell) {
    const angle = (Math.PI / 180) * 60;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const px = x + size * Math.cos(angle * i);
        const py = y + size * Math.sin(angle * i);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = cell.highlighted ? 'yellow' : cell.getColor(); // Highlight color
    ctx.strokeStyle = cell.faction ? '#000' : '#AAA'; // Outline color
    ctx.lineWidth = cell.faction ? 2 : 1; // Thicker outline for claimed cells
    ctx.fill();
    ctx.stroke();
}

export function drawGrid(ctx, grid, hexSize, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach(cell => {
        const { x, y } = hexToPixel(cell.q, cell.r, hexSize, canvas);
        drawHex(ctx, x, y, hexSize, cell);
    });
}

function hexToPixel(q, r, hexSize, canvas) {
    const dx = hexSize * 1.5;
    const dy = hexSize * Math.sqrt(3);
    const x = q * dx;
    const y = r * dy + (q % 2) * (dy / 2);
    return { x: x + canvas.width / 2, y: y + canvas.height / 2 };
}

module.exports = { drawHex, drawGrid };