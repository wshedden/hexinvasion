import { drawGrid } from './utils';
import { decideBestMove } from '../utils/decisionLogic';
import { moveSoldiersToContestedTiles } from '../utils/factionLogic';

let currentFactionIndex = 0;

function processFactionTurn(grid, factions) {
    const faction = factions[currentFactionIndex];
    decideBestMove(grid, faction);
    moveSoldiersToContestedTiles(grid, faction);

    // Increase population of occupied cells
    grid.forEach(cell => {
        if (cell.faction) {
            cell.population += 1;
            cell.soldiers = Math.floor(cell.population / 10); // Update soldiers based on population
        }
    });

    drawGrid(grid);

    // Move to the next faction
    currentFactionIndex = (currentFactionIndex + 1) % factions.length;

    // Schedule the next faction's turn
    setTimeout(() => processFactionTurn(grid, factions), 500);
}

export function gameLoop(grid, factions) {
    // Start the first faction's turn
    processFactionTurn(grid, factions);
}