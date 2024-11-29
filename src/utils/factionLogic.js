// src/utils/factionLogic.js

import { getNeighbors } from './utils'; // Ensure this import is correct

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

export function moveSoldiersToContestedTiles(grid, faction) {
    const factionCells = grid.filter(cell => cell.faction === faction);
    factionCells.forEach(cell => {
        const neighbors = getNeighbors(cell.q, cell.r);
        const friendlyNeighbors = neighbors.filter(neighbor => neighbor.faction === faction);
        if (friendlyNeighbors.length > 0) {
            const targetCell = friendlyNeighbors[0]; // Move soldiers to the first friendly neighbor
            if (cell.soldiers > 0) {
                targetCell.soldiers += cell.soldiers;
                cell.soldiers = 0;
            }
        }
    });
}
