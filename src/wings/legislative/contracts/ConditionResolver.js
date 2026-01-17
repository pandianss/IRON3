/**
 * ICE Contract Logic: Condition Resolver
 * Role: Evaluates the "Condition System" against Institutional State.
 * Guarantees: Deterministic boolean output.
 */

export class ConditionResolver {
    constructor(kernel) {
        this.kernel = kernel; // Access to State and Ledger
    }

    /**
     * Evaluates a ConditionGroup or Condition.
     * @param {object} condition - ConditionGroup | Condition
     * @returns {boolean}
     */
    evaluate(condition) {
        if (!condition) return true; // Empty condition implies strictly True? Or False? Usually True (no barrier).

        // Recursive Groups
        if (condition.all) return this.evaluateAll(condition.all);
        if (condition.any) return this.evaluateAny(condition.any);
        if (condition.not) return !this.evaluate(condition.not);

        // Leaf Conditions
        if (condition.standing) return this.checkStanding(condition.standing);
        if (condition.temporal) return this.checkTemporal(condition.temporal);
        if (condition.memory) return this.checkMemory(condition.memory);
        if (condition.behavioral) return this.checkBehavioral(condition.behavioral);

        // Default safe fallback (unknown condition)
        console.warn("ICE: Unknown Condition Type", condition);
        return false;
    }

    evaluateAll(conditions) {
        return conditions.every(c => this.evaluate(c));
    }

    evaluateAny(conditions) {
        return conditions.some(c => this.evaluate(c));
    }

    // --- LEAF EVALUATORS ---

    checkStanding(criteria) {
        const current = this.kernel.state.getDomain('standing');
        if (!current) return false;

        if (criteria.is && current.state !== criteria.is) return false;
        if (criteria.isNot && current.state === criteria.isNot) return false;
        if (criteria.integrityAbove && current.integrity <= criteria.integrityAbove) return false;

        return true;
    }

    checkTemporal(criteria) {
        // Requires Temporal Domain or calculation
        const now = new Date(); // In simulation, get from Kernel Time

        if (criteria.temporal?.cycle === 'DAILY') {
            // Check if within cycle... complex, stub for now
            return true;
        }
        return true;
    }

    checkMemory(criteria) {
        const ledger = this.kernel.ledger;
        // Example: countAbove
        if (criteria.eventOccurred) {
            const events = ledger.query(e => e.type === criteria.eventOccurred);
            return events.length > 0;
        }
        return true;
    }

    checkBehavioral(criteria) {
        // Stub
        return true;
    }
}
