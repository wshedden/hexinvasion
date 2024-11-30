// public/handlers.js
import { hexToPixel } from '../src/utils.js';
import { showCellInfoPanel } from '../src/utils/uiUtils.js';

export function handleCanvasClick(grid, hexSize) {
    return function (e) {
        const x = e.offsetX;
        const y = e.offsetY;

        const clickedCell = grid.find(cell => {
            const { x: cellX, y: cellY } = hexToPixel(cell.q, cell.r);
            return Math.hypot(x - cellX, y - cellY) < hexSize;
        });

        if (clickedCell) {
            showCellInfoPanel(clickedCell);
        }
    };
}

export function handleKeyDown(factions, activeFactionIndex, setActiveFaction) {
    return function (e) {
        if (e.key === ' ') {
            activeFactionIndex = (activeFactionIndex + 1) % factions.length;
            setActiveFaction(factions[activeFactionIndex]);
            console.log(`Active faction: ${factions[activeFactionIndex].name}`);
        }
    };
}