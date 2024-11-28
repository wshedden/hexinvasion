export function decideBestMove(grid, faction) {
    const neighboringCells = getFactionNeighbors(faction);
    if (neighboringCells.length > 0) {
        // Pick the cell with the highest fertility
        const bestCell = neighboringCells.reduce((maxCell, cell) => cell.fertility > maxCell.fertility ? cell : maxCell, neighboringCells[0]);
        claimCell(grid, bestCell.q, bestCell.r, faction, `Player${faction}`);
    }
}