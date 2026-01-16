/**
 * Principle Registry
 * Canonical repository of principles.
 */
export class PrincipleRegistry {
    constructor() {
        this.principles = new Map();
    }

    register(principle) {
        if (!principle.id) throw new Error("Principle ID required");
        this.principles.set(principle.id, principle);
    }

    getAll() {
        return Array.from(this.principles.values());
    }

    get(id) {
        return this.principles.get(id);
    }
}
