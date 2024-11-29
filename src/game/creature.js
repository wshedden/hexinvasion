export default class Creature {
    constructor(id, q, r) {
        this.id = id;
        this.q = q;
        this.r = r;
    }

    moveTo(q, r) {
        this.q = q;                                                                                                                                                                                                                                                                                                                                                                                                              
        this.r = r;
    }
}