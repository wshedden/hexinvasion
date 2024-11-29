// src/game/cell.js

export default class Cell {
    constructor(q, r) {
        this.q = q;
        this.r = r;
        this.faction = null;
        this.owner = null;
        this.population = 0;
        this.soldiers = 0;
        this.neighbors = [];
        this.highlighted = false; // New property
        this.threatened = false; // New property
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

    addNeighbor(neighbor) {
        this.neighbors.push(neighbor);
    }

    getColor() {
        const colorMap = {
            red: '#8B0000',
            blue: '#00008B'
        };
        return this.faction ? colorMap[this.faction] || '#CCCCCC' : '#FFFFFF';
    }

    calculateThreatened(neighbors) {
        this.threatened = neighbors.some(neighbor => neighbor.faction && neighbor.faction !== this.faction);
    }
}
