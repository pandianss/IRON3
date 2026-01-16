/**
 * Audit Ledger
 * Institutional Memory. Append-only logging.
 */
export class AuditLedger {
    constructor() {
        this.history = [];
    }

    /**
     * recordDecision - Logs a governance decision.
     * @param {object} decision 
     */
    recordDecision(decision) {
        const record = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            type: 'DECISION',
            ...decision
        };
        this.history.push(record);
        return record.id;
    }

    /**
     * recordTransition - Logs a lifecycle transition.
     * @param {object} transition 
     */
    recordTransition(transition) {
        const record = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            type: 'TRANSITION',
            ...transition
        };
        this.history.push(record);
    }

    /**
     * recordViolation - Logs a constitutional violation.
     * @param {object} violation 
     */
    recordViolation(violation) {
        const record = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            type: 'VIOLATION',
            ...violation
        };
        this.history.push(record);
        console.warn(`AUDIT: Violation Recorded [${record.id}]`, violation);
    }

    exportEvidence() {
        return [...this.history];
    }

    _generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
