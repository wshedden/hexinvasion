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
                grid.push({ q, r, faction: null, owner: null, fertility: Math.floor(Math.random() * 11), population: 0 });
            }
        }
    }

    // Initial setup: claim specific cells for blue and red factions
    async function initialSetup() {
        try {
            const response = await fetch('/api/grid');
            const gridData = await response.json();
            console.log('Grid Data:', gridData);
        } catch (error) {
            console.error('Error fetching grid:', error);
        }

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
            drawHex(x, y, hexSize, cell);
        });
    }

    // Get border color based on neighboring factions
    function getBorderColor(cell) {
        const neighbors = getNeighbors(cell.q, cell.r);
        const neighborFactions = new Set(neighbors.map(neighbor => neighbor.faction).filter(faction => faction));
        if (neighborFactions.size === 1) {
            return Array.from(neighborFactions)[0];
        } else if (neighborFactions.size > 1) {
            // Mix colors if bordered by multiple factions
            return 'purple'; // Example mixed color
        }
        return '#AAA'; // Default border color
    }

    // Draw a single hex
    function drawHex(x, y, size, cell) {
        const angle = (Math.PI / 180) * 60;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const px = x + size * Math.cos(angle * i);
            const py = y + size * Math.sin(angle * i);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = cell.faction ? factions.includes(cell.faction) ? cell.faction : '#CCC' : '#FFF';
        ctx.strokeStyle = cell.faction ? '#000' : getBorderColor(cell); // Outline color based on faction or border
        ctx.lineWidth = cell.faction ? 2 : 1; // Thicker outline for claimed cells
        ctx.fill();
        ctx.stroke();

        // Draw population dots
        if (cell.population > 0) {
            const dotRadius = 3;
            const dotSpacing = 2 * dotRadius + 2;
            const maxDotsPerRow = Math.floor(size / dotSpacing);
            const totalDots = Math.min(cell.population, maxDotsPerRow * maxDotsPerRow);
            for (let i = 0; i < totalDots; i++) {
                const row = Math.floor(i / maxDotsPerRow);
                const col = i % maxDotsPerRow;
                const dotX = x - (maxDotsPerRow - 1) * dotSpacing / 2 + col * dotSpacing;
                const dotY = y - (maxDotsPerRow - 1) * dotSpacing / 2 + row * dotSpacing;
                ctx.beginPath();
                ctx.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
                ctx.fillStyle = '#000';
                ctx.fill();
            }
        }
    }

    // Show faction info panel
    function showFactionInfoPanel() {
        const infoPanel = document.getElementById('faction-info-panel');
        let infoHTML = '<h2>Faction Information</h2>';
        factions.forEach(faction => {
            const factionCells = grid.filter(cell => cell.faction === faction);
            const totalPopulation = factionCells.reduce((sum, cell) => sum + cell.population, 0);
            const totalSoldiers = Math.floor(totalPopulation / 100);
            infoHTML += `<h3>${faction.charAt(0).toUpperCase() + faction.slice(1)} Faction</h3>`;
            infoHTML += `<p>Cells Claimed: ${factionCells.length}</p>`;
            infoHTML += `<p>Total Population: ${totalPopulation}</p>`;
            infoHTML += `<p>Total Soldiers: ${totalSoldiers}</p>`;
        });
        infoPanel.innerHTML = infoHTML;
        infoPanel.style.display = 'block';
    }

    // Show cell info panel
    function showCellInfoPanel(cell) {
        const infoPanel = document.getElementById('cell-info-panel');
        infoPanel.innerHTML = `
            <h2>Cell Information</h2>
            <p><strong>Coordinates:</strong> (${cell.q}, ${cell.r})</p>
            <p><strong>Faction:</strong> ${cell.faction || 'Unclaimed'}</p>
            <p><strong>Owner:</strong> ${cell.owner || 'None'}</p>
            <p><strong>Fertility:</strong> ${cell.fertility}</p>
            <p><strong>Population:</strong> ${cell.population}</p>
        `;
        infoPanel.style.display = 'block';
    }

    // Claim a cell for a faction and owner
    function claimCell(grid, q, r, faction, owner) {
        const cell = grid.find(cell => cell.q === q && cell.r === r);
        if (cell && !cell.faction) {
            cell.faction = faction; // Claim the cell for the faction
            cell.owner = owner; // Set the owner of the cell
            cell.population = 1; // Initialize population
            showFactionInfoPanel(); // Update the faction info panel
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

    // Decide the best move for a faction
    function decideBestMove(faction) {
        const neighboringCells = getFactionNeighbors(faction);
        if (neighboringCells.length > 0) {
            // Pick the cell with the highest fertility
            const bestCell = neighboringCells.reduce((maxCell, cell) => cell.fertility > maxCell.fertility ? cell : maxCell, neighboringCells[0]);
            claimCell(grid, bestCell.q, bestCell.r, faction, `Player${faction}`);
        }
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
            showCellInfoPanel(clickedCell);
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
            decideBestMove(faction);
        });

        // Increase population of occupied cells
        grid.forEach(cell => {
            if (cell.faction) {
                cell.population += 1;
            }
        });

        drawGrid();
    }

    initialSetup();
    drawGrid();
    showFactionInfoPanel(); // Initial call to show faction info panel

    // Start the game loop
    setInterval(gameLoop, 1000);
})();