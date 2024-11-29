// utils.js

// Convert axial coordinates to pixel
export function hexToPixel(q, r, hexSize, canvas) {
    const dx = hexSize * 1.5;
    const dy = hexSize * Math.sqrt(3);
    const x = q * dx;
    const y = r * dy + (q % 2) * (dy / 2);
    return { x: x + canvas.width / 2, y: y + canvas.height / 2 };
}

// Draw the grid
export function drawGrid(ctx, grid, hexSize, canvas, creatures) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach(cell => {
        const { x, y } = hexToPixel(cell.q, cell.r, hexSize, canvas);
        drawHex(ctx, x, y, hexSize, cell);
    });
    drawCreatures(ctx, creatures, hexSize, canvas);
}

// Draw a single hex
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
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#AAA'; // Default border color
    ctx.lineWidth = 1; // Default outline
    ctx.fill();
    ctx.stroke();
}

// Draw creatures on the grid
function drawCreatures(ctx, creatures, hexSize, canvas) {
    creatures.forEach(creature => {
        const { x, y } = hexToPixel(creature.q, creature.r, hexSize, canvas);
        drawCreature(ctx, x, y);
    });
}

// Draw a single creature
function drawCreature(ctx, x, y) {
    const creatureSize = 10; // Size of the creature
    ctx.beginPath();
    ctx.arc(x, y, creatureSize, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000'; // Creature color
    ctx.fill();
    ctx.stroke();
}

export function getNeighbors(q, r, grid) {
    const directions = [
        { dq: 1, dr: 0 }, { dq: 1, dr: -1 }, { dq: 0, dr: -1 },
        { dq: -1, dr: 0 }, { dq: -1, dr: 1 }, { dq: 0, dr: 1 }
    ];
    return directions.map(dir => {
        return grid.find(cell => cell.q === q + dir.dq && cell.r === r + dir.dr);
    }).filter(cell => cell !== undefined);
}