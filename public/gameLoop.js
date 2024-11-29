import { drawGrid } from './utils';
import { decideBestMove } from '../utils/decisionLogic';
import { moveSoldiersToContestedTiles } from '../utils/factionLogic';

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
        }
    });

    drawGrid(grid);
}