// src/utils/factionLogic.js

export function claimCell(grid, q, r, faction, owner) {
    const cell = grid.find(cell => cell.q === q && cell.r === r);
    if (cell && !cell.faction) {
        cell.faction = faction;
        cell.owner = owner;
        cell.population = 1;
        return true;
    }
    return false; // Cell already claimed or invalid
}
