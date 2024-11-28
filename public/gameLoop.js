import { decideBestMove } from '../utils/decisionLogic';
import { drawGrid } from './utils';

export function gameLoop(grid, factions) {
    factions.forEach(faction => {
        decideBestMove(grid, faction);
    });

    // Decrease wealth based on population and handle cell loss
    grid.forEach(cell => {
        if (cell.faction) {
            cell.wealth -= cell.population;
            if (cell.wealth <= 0) {
                cell.faction = null;
                cell.owner = null;
                cell.population = 0;
                cell.wealth = 100; // Reset wealth for unclaimed cell
            } else {
                cell.population += 1;
            }
        }
    });

    drawGrid(grid);
}

// src/utils/uiUtils.js

export function showCellInfoPanel(cell) {
    const infoPanel = document.getElementById('cell-info-panel');
    infoPanel.innerHTML = `
        <h2>Cell Information</h2>
        <p><strong>Coordinates:</strong> (${cell.q}, ${cell.r})</p>
        <p><strong>Faction:</strong> ${cell.faction || 'Unclaimed'}</p>
        <p><strong>Owner:</strong> ${cell.owner || 'None'}</p>
        <p><strong>Fertility:</strong> ${cell.fertility}</p>
        <p><strong>Population:</strong> ${cell.population}</p>
        <p><strong>Wealth:</strong> ${cell.wealth}</p>
        <p><strong>Soldiers:</strong> ${Math.floor(cell.population / 10)}</p>
    `;
    infoPanel.style.display = 'block';
}