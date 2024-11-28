// src/utils/uiUtils.js

export function showFactionInfoPanel(grid, factions) {
    const infoPanel = document.getElementById('faction-info-panel');
    let infoHTML = '<h2>Faction Information</h2>';
    factions.forEach(faction => {
        const factionCells = grid.filter(cell => cell.faction === faction);
        const totalFertility = factionCells.reduce((sum, cell) => sum + cell.fertility, 0);
        const totalWealth = factionCells.reduce((sum, cell) => sum + cell.wealth, 0);
        infoHTML += `<h3>${faction.charAt(0).toUpperCase() + faction.slice(1)} Faction</h3>`;
        infoHTML += `<p>Cells Claimed: ${factionCells.length}</p>`;
        infoHTML += `<p>Total Fertility: ${totalFertility}</p>`;
        infoHTML += `<p>Total Wealth: ${totalWealth}</p>`;
    });
    infoPanel.innerHTML = infoHTML;
    infoPanel.style.display = 'block';
}

export function showCellInfoPanel(cell) {
    const infoPanel = document.getElementById('cell-info-panel');
    infoPanel.innerHTML = `
        <h2>Cell Information</h2>
        <p><strong>Coordinates:</strong> (${cell.q}, ${cell.r})</p>
        <p><strong>Faction:</strong> ${cell.faction || 'Unclaimed'}</p>
        <p><strong>Owner:</strong> ${cell.owner || 'None'}</p>
        <p><strong>Fertility:</strong> ${cell.fertility}</p>
        <p><strong>Population:</strong> ${cell.population}</p>
    `;
    infoPanel.style.display = 'block';
}

// Show cell info panel when a cell is clicked
canvas.addEventListener('click', e => {
    const x = e.offsetX;
    const y = e.offsetY;

    const clickedCell = grid.find(cell => {
        const { x: cellX, y: cellY } = hexToPixel(cell.q, cell.r);
        return Math.hypot(x - cellX, y - cellY) < hexSize;
    });

    if (clickedCell) {
        showCellInfoPanel(clickedCell);
    }
});

// Update faction info panel periodically or after certain actions
setInterval(() => {
    showFactionInfoPanel(grid, factions);
}, 1000);
