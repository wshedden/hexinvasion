import Cell from '../src/game/cell.js'; // Import the Cell class

(async function () {
    console.log('HexInvasion frontend loaded');

    const GRID_SIZE = 5; // Hardcoded for prototype
    const factions = ['red', 'blue'];
    let activeFactionIndex = 0; // Index to keep track of the current faction's turn
    let activeFaction = factions[activeFactionIndex];
    let activeOwner = 'Player1'; // Example owner
    let hoveredCell = null; // State to keep track of the hovered cell

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
                grid.push(new Cell(q, r)); // Use the Cell class
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
            drawHex(ctx, x, y, hexSize, cell);
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

        // Draw a symbol if the cell is threatened
        if (cell.threatened) {
            ctx.fillStyle = 'red'; // Symbol color
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('!', x, y);
        }
    }

    // Draw creatures within a hex
    function drawCreatures(x, y, size, population) {
        const creatureSize = 5; // Size of each creature
        const maxCreatures = Math.min(population, 6); // Limit the number of creatures to 6
        for (let i = 0; i < maxCreatures; i++) {
            const angle = (Math.PI / 180) * (60 * i);
            const cx = x + (size / 2) * Math.cos(angle);
            const cy = y + (size / 2) * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(cx, cy, creatureSize, 0, 2 * Math.PI);
            ctx.fillStyle = '#000'; // Creature color
            ctx.fill();
        }
    }

    // Show faction info panel
    function showFactionInfoPanel() {
        const infoPanel = document.getElementById('faction-info-panel');
        let infoHTML = '<h2>Faction Information</h2>';
        factions.forEach(faction => {
            const factionCells = grid.filter(cell => cell.faction === faction);
            const totalPopulation = factionCells.reduce((sum, cell) => sum + cell.population, 0);
            const totalSoldiers = factionCells.reduce((sum, cell) => sum + cell.soldiers, 0);
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
            <p><strong>Soldiers:</strong> ${cell.soldiers}</p>
            <p><strong>Wealth:</strong> ${cell.wealth}</p>
            <p><strong>Threatened:</strong> ${cell.threatened}</p>
        `;
        infoPanel.style.display = 'block';
    }

    // Claim a cell for a faction and owner
    function claimCell(grid, q, r, faction, owner) {
        const cell = grid.find(cell => cell.q === q && cell.r === r);
        if (cell && !cell.faction) {
            cell.claim(faction, owner); // Use the claim method from the Cell class
            showFactionInfoPanel(); // Update the faction info panel
            return true;
        }
        return false; // Cell already claimed or invalid
    }

    // Find neighboring cells
    function getAxialNeighbors(q, r) {
        const directions = [
            [1, 0], [-1, 0],
            [0, 1], [0, -1],
            [1, -1], [-1, 1]
        ];

        return directions.map(([dq, dr]) => [q + dq, r + dr]);
    }

    function getNeighbors(q, r) {
        const neighborsCoords = getAxialNeighbors(q, r);
        return neighborsCoords.map(([neighborQ, neighborR]) => {
            const neighbor = grid.find(cell => cell.q === neighborQ && cell.r === neighborR);
            return neighbor;
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

    // Move soldiers to contested tiles
    function moveSoldiersToContestedTiles(faction) {
        const factionCells = grid.filter(cell => cell.faction === faction);
        factionCells.forEach(cell => {
            const neighbors = getNeighbors(cell.q, cell.r);
            const contestedNeighbors = neighbors.filter(neighbor => neighbor.faction && neighbor.faction !== faction);
            if (contestedNeighbors.length > 0) {
                const targetCell = contestedNeighbors[0]; // Move soldiers to the first contested neighbor
                if (cell.soldiers > 0) {
                    targetCell.soldiers += cell.soldiers;
                    cell.soldiers = 0;
                }
            }
        });
    }

    // Handle mouse move to detect hovered cell
    canvas.addEventListener('mousemove', e => {
        const x = e.offsetX;
        const y = e.offsetY;

        // Find hovered cell
        const hoveredCell = grid.find(cell => {
            const { x: cellX, y: cellY } = hexToPixel(cell.q, cell.r);
            return Math.hypot(x - cellX, y - cellY) < hexSize;
        });

        // Reset highlight status for all cells
        grid.forEach(cell => cell.highlighted = false);

        if (hoveredCell) {
            hoveredCell.highlighted = true;
            hoveredCell.neighbors.forEach(neighbor => neighbor.highlighted = true);
        }

        drawGrid(); // Redraw the grid to show highlighting
    });

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
            activeFactionIndex = (activeFactionIndex + 1) % factions.length;
            activeFaction = factions[activeFactionIndex];
            console.log(`Active faction: ${activeFaction}`);
        }
    });

    // Game loop
    function gameLoop() {
        decideBestMove(activeFaction);
        moveSoldiersToContestedTiles(activeFaction);

        // Increase population of occupied cells
        grid.forEach(cell => {
            if (cell.faction) {
                cell.population += 1;
                cell.soldiers = Math.floor(cell.population / 10); // Update soldiers based on population
                const neighbors = getNeighbors(cell.q, cell.r);
                cell.calculateThreatened(neighbors); // Calculate threatened value based on neighbors
            }
        });

        drawGrid();

        // Switch to the next faction
        activeFactionIndex = (activeFactionIndex + 1) % factions.length;
        activeFaction = factions[activeFactionIndex];
    }

    initialSetup();
    setInterval(gameLoop, 1000); // Run the game loop every second
})();