import { JSDOM } from 'jsdom';
import { showCellInfoPanel } from '../src/utils/uiUtils';
import Cell from '../src/game/cell';

describe('HexInvasion Cell Info Panel Tests', () => {
    let dom;
    let document;
    let cell;

    beforeAll(() => {
        dom = new JSDOM(`<!DOCTYPE html><html><body><div id="cell-info-panel"></div></body></html>`);
        document = dom.window.document;
        global.document = document;
        global.window = dom.window;

        // Create a cell instance
        cell = new Cell(0, 0);
        cell.faction = 'blue';
        cell.owner = 'PlayerBlue';
        cell.population = 10;
        cell.soldiers = 5;
        cell.fertility = 7;
        cell.wealth = 100;
        cell.threatened = false;
    });

    test('Cell info panel updates correctly', () => {
        showCellInfoPanel(cell);

        const infoPanel = document.getElementById('cell-info-panel');
        expect(infoPanel.innerHTML).toContain('Coordinates: (0, 0)');
        expect(infoPanel.innerHTML).toContain('Faction: blue');
        expect(infoPanel.innerHTML).toContain('Owner: PlayerBlue');
        expect(infoPanel.innerHTML).toContain('Population: 10');
        expect(infoPanel.innerHTML).toContain('Soldiers: 5');
        expect(infoPanel.innerHTML).toContain('Fertility: 7');
        expect(infoPanel.innerHTML).toContain('Wealth: 100');
        expect(infoPanel.innerHTML).toContain('Threatened: false');
    });

    test('Cell info panel displays "Unclaimed" for unclaimed cells', () => {
        const unclaimedCell = new Cell(1, 1);
        showCellInfoPanel(unclaimedCell);

        const infoPanel = document.getElementById('cell-info-panel');
        expect(infoPanel.innerHTML).toContain('Coordinates: (1, 1)');
        expect(infoPanel.innerHTML).toContain('Faction: Unclaimed');
        expect(infoPanel.innerHTML).toContain('Owner: None');
    });
});