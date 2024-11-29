// utils/draw.js
export function drawHex(ctx, x, y, size, cell) {
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