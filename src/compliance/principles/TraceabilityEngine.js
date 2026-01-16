/**
 * Traceability Engine Module
 * Maps Principles to Rules, Mechanisms, Tests, etc.
 * 
 * Functions:
 * - link(sourceId, targetId, type): Creates a traceability link.
 * - getTrace(id): Returns upstream and downstream links for an item.
 */

class TraceabilityEngine {
    constructor() {
        // Adjacency list for graph: id -> [{ targetId, type, direction }]
        this.graph = new Map();
    }

    /**
     * link - Creates a bidirectional link between two entities.
     * @param {string} sourceId - The ID of the source entity (e.g., Principle ID).
     * @param {string} targetId - The ID of the target entity (e.g., Rule ID).
     * @param {string} type - The type of relationship (e.g., 'enforced_by', 'verified_by').
     */
    link(sourceId, targetId, type) {
        this._addNode(sourceId);
        this._addNode(targetId);

        // Forward link
        this.graph.get(sourceId).push({ targetId, type, direction: 'forward' });

        // Backward link (implicit inverse for traceability)
        this.graph.get(targetId).push({ targetId: sourceId, type, direction: 'backward' });
    }

    _addNode(id) {
        if (!this.graph.has(id)) {
            this.graph.set(id, []);
        }
    }

    /**
     * getTrace - Retrieves all links associated with an entity.
     * @param {string} id - The entity ID.
     * @returns {Object} { upstream: [], downstream: [] }
     */
    getTrace(id) {
        const links = this.graph.get(id) || [];
        const trace = {
            upstream: [],
            downstream: []
        };

        links.forEach(link => {
            if (link.direction === 'forward') {
                trace.downstream.push(link);
            } else {
                trace.upstream.push(link);
            }
        });

        return trace;
    }
}

export default new TraceabilityEngine();
