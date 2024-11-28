(async function () {
    console.log('HexInvasion frontend loaded');

    const GRID_SIZE = 5; // Hardcoded for prototype
    const factions = ['red', 'blue'];
    let activeFaction = factions[0];
    let activeOwner = 'Player1'; // Example owner

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
                grid.push({ q, r, faction: null, owner: null });
            }
        }
    }

    // Initial setup: claim specific cells for blue and red factions
    function initialSetup() {
        claimCell(grid, 0, 0, 'blue', 'PlayerBlue'); // Blue faction starts with cell (0, 0)
        claimCell(grid, 1, -1, 'red', 'PlayerRed'); // Red faction starts with cell (1, -1)
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
        ctx.strokeStyle = faction ? '#000' : '#AAA'; // Outline color based on faction
        ctx.lineWidth = faction ? 2 : 1; // Thicker outline for claimed cells
        ctx.fill();
        ctx.stroke();
    }

    // Show info panel
    function showInfoPanel() {
        const infoPanel = document.getElementById('info-panel');
        let infoHTML = '<h2>Faction Information</h2>';
        factions.forEach(faction => {
            infoHTML += `<h3>${faction.charAt(0).toUpperCase() + faction.slice(1)} Faction</h3><ul>`;
            const factionCells = grid.filter(cell => cell.faction === faction);
            factionCells.forEach(cell => {
                infoHTML += `<li>Cell (${cell.q}, ${cell.r}) - Owner: ${cell.owner}</li>`;
            });
            infoHTML += '</ul>';
        });
        infoPanel.innerHTML = infoHTML;
        infoPanel.style.display = 'block';
    }

    // Claim a cell for a faction and owner
    function claimCell(grid, q, r, faction, owner) {
        const cell = grid.find(cell => cell.q === q && cell.r === r);
        if (cell && !cell.faction) {
            cell.faction = faction; // Claim the cell for the faction
            cell.owner = owner; // Set the owner of the cell
            showInfoPanel(); // Update the info panel
            return true;
        }
        return false; // Cell already claimed or invalid
    }

    // Find neighboring cells
    function getNeighbors(q, r) {
        const directions = [
            { dq: 1, dr: 0 }, { dq: 1, dr: -1 }, { dq: 0, dr: -1 },
            { dq: -1, dr: 0 }, { dq: -1, dr: 1 }, { dq: 0, dr: 1 }
        ];
        return directions.map(dir => {
            return grid.find(cell => cell.q === q + dir.dq && cell.r === r + dir.dr);
        }).filter(cell => cell !== undefined);
    }

    // Find all cells a faction neighbors
    function getFactionNeighbors(faction) {
        const factionCells = grid.filter(cell => cell.faction === faction);
        const neighbors = new Set();
        factionCells.forEach(cell => {
            getNeighbors(cell.q, cell.r).forEach(neighbor => {
                if (!neighbor.faction) {
                    neighbors.add(neighbor);
                }
            });
        });
        return Array.from(neighbors);
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

        if (clickedCell) {
            showInfoPanel(clickedCell);
        }
    });

    // Toggle faction
    document.addEventListener('keydown', e => {
        if (e.key === ' ') {
            activeFaction = factions[(factions.indexOf(activeFaction) + 1) % factions.length];
            console.log(`Active faction: ${activeFaction}`);
        }
    });

    // Game loop
    function gameLoop() {
        factions.forEach(faction => {
            // Claim a random neighboring cell
            const neighboringCells = getFactionNeighbors(faction);
            if (neighboringCells.length > 0) {
                const randomCell = neighboringCells[Math.floor(Math.random() * neighboringCells.length)];
                claimCell(grid, randomCell.q, randomCell.r, faction, `Player${faction}`);
            }
        });
        drawGrid();
    }

    initialSetup();
    drawGrid();
    showInfoPanel(); // Initial call to show info panel

    // Start the game loop
    setInterval(gameLoop, 1000);
})();
