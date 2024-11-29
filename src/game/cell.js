// src/game/cell.js

export default class Cell {
    constructor(q, r) {
        this.q = q;
        this.r = r;
        this.faction = null;
        this.owner = null;
        this.population = 0;
        this.soldiers = 0;
        this.army = false; // New property to indicate if the cell contains an army
    }

    claim(faction, owner) {
        this.faction = faction;
        this.owner = owner;
    }

    addSoldiers(count) {
        this.soldiers += count;
    }

    removeSoldiers(count) {
        this.soldiers = Math.max(0, this.soldiers - count);
    }

    getColor() {
        const colorMap = {
            red: '#8B0000',
            blue: '#00008B'
        };
        return this.faction ? colorMap[this.faction] || '#CCCCCC' : '#FFFFFF';
    }

    calculateThreatened(neighbors) {
        // Calculate threatened value based on neighbors
    }
}
