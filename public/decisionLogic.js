import { claimCell } from './factionLogic';

export function decideBestMove(grid, faction, getFactionNeighbors) {
    const neighboringCells = getFactionNeighbors(grid, faction);
    if (neighboringCells.length > 0) {
        const bestCell = neighboringCells.reduce((maxCell, cell) =>
            cell.fertility > maxCell.fertility ? cell : maxCell, neighboringCells[0]);
        claimCell(grid, bestCell.q, bestCell.r, faction, `Player${faction}`);
    }
}