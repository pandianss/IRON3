/**
 * Compliance Gate
 * The Non-Bypassable Checkpoint.
 */
export class ComplianceGate {
    constructor(engine, ledger, stateMonitor) {
        this.engine = engine;
        this.ledger = ledger;
        this.stateMonitor = stateMonitor;
    }

    /**
     * govern - Wraps a governed operation.
     * @param {object} action - { type, payload, actor, rules }
     * @param {function} operation - The actual function to execute if allowed.
     */
    async govern(action, operation) {
        // 1. Pre-check Legality (Rule Engine)
        const ruleIds = action.rules || [];
        const context = {
            action,
            state: this.stateMonitor.getState()
        };

        const rejectionReasons = [];
        let allowed = true;

        for (const ruleId of ruleIds) {
            const verdict = this.engine.evaluate(ruleId, context);
            if (!verdict.allowed) {
                allowed = false;
                rejectionReasons.push(`[${ruleId}] ${verdict.reason}`);
            }
        }

        // 2. Audit Decision
        this.ledger.recordDecision({
            action: action.type,
            allowed,
            rejectionReasons,
            context: { actor: action.actor }
        });

        if (!allowed) {
            console.error(`GATE: Action ${action.type} Blocked: ${rejectionReasons.join(', ')}`);
            throw new Error(`Compliance Violation: ${rejectionReasons.join(', ')}`);
        }

        // 3. Execute Operation
        try {
            const result = await operation();
            return result;
        } catch (e) {
            // Audit execution failure?
            throw e;
        }
    }

    /**
     * mediateEvent - Specialized gate for event ingestion.
     * @param {string} eventType 
     * @param {object} payload 
     * @param {string} actorId 
     * @returns {boolean} allowed
     */
    mediateEvent(eventType, payload, actorId) {
        // Global Ingest Rules could be checked here
        // For MVP, we pass through or check basic invariants
        // We can use govern() internally if we treat 'ingest' as an operation.

        // This method is called synchronously by Kernel.ingest usually used for quick checks
        // Reuse govern pattern?

        // Let's keep it simple for now:
        const context = { eventType, payload, actorId, state: this.stateMonitor.getState() };
        // Check global ingest rules if any (none registered by default yet)
        return { allowed: true };
    }
}
