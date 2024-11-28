import { QclaimCell } from './factionLogic';

// Generate hex grid
const grid = [];
for (let q = -GRID_SIZE; q <= GRID_SIZE; q++) {
    for (let r = -GRID_SIZE; r <= GRID_SIZE; r++) {
        if (Math.abs(q + r) <= GRID_SIZE) {
            grid.push({ q, r, faction: null, owner: null, fertility: Math.floor(Math.random() * 11), population: 0, wealth: 100, soldiers: 0 });
        }
    }
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