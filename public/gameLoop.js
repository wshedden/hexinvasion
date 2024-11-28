import { decideBestMove } from './decisionLogic.js';
import { drawGrid } from './utils.js';

export function gameLoop(grid, factions) {
    factions.forEach(faction => {
        decideBestMove(grid, faction);
    });

    // Increase population of occupied cells
    grid.forEach(cell => {
        if (cell.faction) {
            cell.population += 1;
        }
    });

    drawGrid(grid);
}