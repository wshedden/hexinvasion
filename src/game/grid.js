const { GRID_SIZE } = require('../utils/constants');

function createHexGrid(size) {
    const grid = [];
    for (let q = -size; q <= size; q++) {
        for (let r = -size; r <= size; r++) {
            if (Math.abs(q + r) <= size) {
                grid.push({ q, r, faction: null }); // faction: null = unclaimed
            }
        }
    }
    return grid;
}

function claimCell(grid, q, r, faction) {
    const cell = grid.find(cell => cell.q === q && cell.r === r);
    if (cell && !cell.faction) {
        cell.faction = faction; // Claim the cell for the faction
        return true;
    }
    return false; // Cell already claimed or invalid
}

module.exports = { createHexGrid, claimCell };
