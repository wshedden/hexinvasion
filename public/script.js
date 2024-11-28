(async function () {
    const GRID_SIZE = 5; // Hardcoded for prototype
    const factions = ['red', 'blue'];
    let activeFaction = factions[0];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    const hexSize = 30; // Size of each hex
    canvas.width = 800;
    canvas.height = 600;

    // Generate hex grid
    const grid = [];
    for (let q = -GRID_SIZE; q <= GRID_SIZE; q++) {
        for (let r = -GRID_SIZE; r <= GRID_SIZE; r++) {
            if (Math.abs(q + r) <= GRID_SIZE) {
                grid.push({ q, r, faction: null });
            }
        }
    }

    // Convert axial coordinates to pixel
    function hexToPixel(q, r) {
        const dx = hexSize * 1.5;
        const dy = hexSize * Math.sqrt(3);
        const x = q * dx;
        const y = r * dy + (q % 2) * (dy / 2);
        return { x: x + canvas.width / 2, y: y + canvas.height / 2 };
    }

    // Draw the grid
    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        grid.forEach(cell => {
            const { x, y } = hexToPixel(cell.q, cell.r);
            drawHex(x, y, hexSize, cell.faction);
        });
    }

    // Draw a single hex
    function drawHex(x, y, size, faction) {
        const angle = (Math.PI / 180) * 60;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const px = x + size * Math.cos(angle * i);
            const py = y + size * Math.sin(angle * i);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = faction ? factions.includes(faction) ? faction : '#CCC' : '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
    }

    // Handle clicks
    canvas.addEventListener('click', e => {
        const x = e.offsetX;
        const y = e.offsetY;

        // Find clicked cell
        const clickedCell = grid.find(cell => {
            const { x: cellX, y: cellY } = hexToPixel(cell.q, cell.r);
            return Math.hypot(x - cellX, y - cellY) < hexSize;
        });

        if (clickedCell && !clickedCell.faction) {
            clickedCell.faction = activeFaction;
            drawGrid();
        }
    });

    // Toggle faction
    document.addEventListener('keydown', e => {
        if (e.key === ' ') {
            activeFaction = factions[(factions.indexOf(activeFaction) + 1) % factions.length];
            console.log(`Active faction: ${activeFaction}`);
        }
    });

    drawGrid();
})();
