// src/game/cell.js

export default class Cell {
    constructor(q, r, faction = null, owner = null, fertility = Math.floor(Math.random() * 11), population = 0, soldiers = 0, wealth = 100) {
        this.q = q;
        this.r = r;
        this.faction = faction;
        this.owner = owner;
        this.fertility = fertility;
        this.population = population;
        this.soldiers = soldiers;
        this.wealth = wealth;
        this.threatened = 0; // Initialize threatened value
    }

    claim(faction, owner) {
        if (!this.faction) {
            this.faction = faction;
            this.owner = owner;
            this.soldiers = 10; // Initialize soldiers
            return true;
        }
        return false; // Cell already claimed or invalid
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
        this.threatened = neighbors.reduce((sum, neighbor) => {
            if (neighbor.faction && neighbor.faction !== this.faction) {
                return sum + neighbor.soldiers;
            }
            return sum;
        }, 0);
    }
}
