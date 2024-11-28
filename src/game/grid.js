const { GRID_SIZE } = require('../utils/constants');


function createHexGrid(size, shapeFn) {
    const grid = [];
    for (let q = -size; q <= size; q++) {
        for (let r = -size; r <= size; r++) {
            if (shapeFn(q, r, size)) {
                grid.push({ q, r, faction: null, owner: null, fertility: Math.floor(Math.random() * 11), population: 0, wealth: 100 });
            }
        }
    }
    return grid;
}

function hexShape(q, r, size) {
    return Math.abs(q + r) <= size;
}

function rectangleShape(q, r, size) {
    return Math.abs(q) <= size && Math.abs(r) <= size;
}

const grid = createHexGrid(GRID_SIZE, rectangleShape);

function claimCell(grid, q, r, faction, owner) {
    const cell = grid.find(cell => cell.q === q && cell.r === r);
    if (cell && !cell.faction) {
        cell.faction = faction; // Claim the cell for the faction
        cell.owner = owner; // Set the owner of the cell
        return true;
    }
    return false; // Cell already claimed or invalid
}

module.exports = { createHexGrid, claimCell };
