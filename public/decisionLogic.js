import { QclaimCell } from './factionLogic';

// Generate hex grid
const grid = [];
const gridMap = new Map(); // Map to store cells by their coordinates

for (let q = -GRID_SIZE; q <= GRID_SIZE; q++) {
    for (let r = -GRID_SIZE; r <= GRID_SIZE; r++) {
        if (Math.abs(q + r) <= GRID_SIZE) {
            const cell = new Cell(q, r);
            grid.push(cell);
            gridMap.set(`${q},${r}`, cell); // Store cell in the map
        }
    }
}

// Set neighbors for each cell
grid.forEach(cell => {
    const neighborsCoords = getAxialNeighbors(cell.q, cell.r);
    neighborsCoords.forEach(([neighborQ, neighborR]) => {
        const neighbor = gridMap.get(`${neighborQ},${neighborR}`);
        if (neighbor) {
            cell.addNeighbor(neighbor);
        }
    });
});

// Find neighboring cells
function getAxialNeighbors(q, r) {
    const directions = [
        [1, 0], [-1, 0],
        [0, 1], [0, -1],
        [1, -1], [-1, 1]
    ];

    return directions.map(([dq, dr]) => [q + dq, r + dr]);
}

// Claim a cell for a faction and owner
function claimCell(grid, q, r, faction, owner) {
    const cell = grid.find(cell => cell.q === q && cell.r === r);
    if (cell && !cell.faction) {
        cell.faction = faction; // Claim the cell for the faction
        cell.owner = owner; // Set the owner of the cell
        cell.population = 1; // Initialize population
        cell.wealth = 100; // Initialize wealth
        cell.soldiers = 10; // Initialize soldiers
        showFactionInfoPanel(); // Update the faction info panel
        return true;
    }
    return false; // Cell already claimed or invalid
}

export function decideBestMove(grid, faction, getFactionNeighbors) {
    const neighboringCells = getFactionNeighbors(grid, faction);
    if (neighboringCells.length > 0) {
        const bestCell = neighboringCells.reduce((maxCell, cell) =>
            cell.fertility > maxCell.fertility ? cell : maxCell, neighboringCells[0]);
        claimCell(grid, bestCell.q, bestCell.r, faction, `Player${faction}`);
    }
}