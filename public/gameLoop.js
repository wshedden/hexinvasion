import { decideBestMove } from '../utils/decisionLogic';
import { drawGrid } from './utils';

export function gameLoop(grid, factions) {
    factions.forEach(faction => {
        decideBestMove(grid, faction);
        moveSoldiersToContestedTiles(faction);
    });

    // Increase population of occupied cells
    grid.forEach(cell => {
        if (cell.faction) {
            cell.population += 1;
            cell.soldiers = Math.floor(cell.population / 10); // Update soldiers based on population
        }
        const neighbors = getNeighbors(cell.q, cell.r);
        cell.calculateThreatened(neighbors); // Calculate threatened value based on neighbors
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
        <p><strong>Soldiers:</strong> ${cell.soldiers}</p>
        <p><strong>Wealth:</strong> ${cell.wealth}</p>
        <p><strong>Threatened:</strong> ${cell.threatened}</p>
    `;
    infoPanel.style.display = 'block';
}