// public/gameLoop.js

import { decideBestMove, moveSoldiersToContestedTiles } from './utils';
import { getNeighbors } from './utils';

export function gameLoop(grid, factions) {
    factions.forEach(faction => {
        decideBestMove(grid, faction);
        moveSoldiersToContestedTiles(grid, faction);
    });

    // Increase population of occupied cells
    grid.forEach(cell => {
        if (cell.faction) {
            cell.population += 1;
            cell.soldiers = Math.floor(cell.population / 10); // Update soldiers based on population
            const neighbors = getNeighbors(cell.q, cell.r);
            cell.calculateThreatened(neighbors); // Calculate threatened value based on neighbors
        }
    });

    drawGrid(grid);
}