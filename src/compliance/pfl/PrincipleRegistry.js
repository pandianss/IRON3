/**
 * Principle Registry Module
 * Canonical repository of principles.
 * 
 * Functions:
 * - register(principle): Adds a principle to the registry.
 * - get(id): Retrieves a principle.
 * - getAll(): Returns all registered principles.
 * - validate(principle): Ensures a principle matches the required schema.
 */

class PrincipleRegistry {
    constructor() {
        this.principles = new Map();
    }

    /**
     * register - Adds a principle to the registry.
     * @param {Object} principle - The principle object to register.
     * @throws {Error} If the principle is invalid or already exists.
     */
    register(principle) {
        this.validate(principle);
        if (this.principles.has(principle.id)) {
            throw new Error(`Principle with ID ${principle.id} already exists.`);
        }
        this.principles.set(principle.id, principle);
    }

    /**
     * get - Retrieves a principle by its ID.
     * @param {string} id - The ID of the principle.
     * @returns {Object|undefined} The principle object or undefined if not found.
     */
    get(id) {
        return this.principles.get(id);
    }

    /**
     * getAll - Returns all registered principles.
     * @returns {Array} An array of all principle objects.
     */
    getAll() {
        return Array.from(this.principles.values());
    }

    /**
     * validate - Validates a principle object against the schema.
     * Schema: { id, text, source, level }
     * @param {Object} principle - The principle object to validate.
     * @throws {Error} If the principle is invalid.
     */
    validate(principle) {
        if (!principle.id || typeof principle.id !== 'string') {
            throw new Error('Principle must have a valid string ID.');
        }
        if (!principle.text || typeof principle.text !== 'string') {
            throw new Error('Principle must have a valid text description.');
        }
        if (!principle.source || typeof principle.source !== 'string') {
            throw new Error('Principle must have a defined source (e.g., Constitution Article).');
        }
        // Level could be optional or defaulted, but let's enforce it for now to be explicit suited for compliance
        if (!principle.level || typeof principle.level !== 'string') {
             // levels: 'supreme', 'derived', 'policy'
             // For now just checking it's a string
             throw new Error('Principle must have a authority level.');
        }
    }
}

export default new PrincipleRegistry();
