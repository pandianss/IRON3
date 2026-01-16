/**
 * Audit Ledger
 * Institutional Memory. Append-only logging.
 * Persisted via localStorage for v1.0 risk mitigation.
 */
export class AuditLedger {
    constructor() {
        this.STORAGE_KEY = 'IRON_AUDIT_LEDGER';
        this.history = this._load() || [];
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
        this._save();
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
        this._save();
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
        this._save();
        console.warn(`AUDIT: Violation Recorded [${record.id}]`, violation);
    }

    exportEvidence() {
        return [...this.history];
    }

    getLog() {
        return this.history;
    }

    _save() {
        try {
            // Safe stringify to handle potential circular references in complex action payloads
            const safeHistory = JSON.stringify(this.history, (key, value) => {
                if (key === 'kernel' || key === 'complianceKernel' || key === 'gate' || key === 'monitor') return '[Filtered Component]';
                return value;
            });
            localStorage.setItem(this.STORAGE_KEY, safeHistory);
        } catch (e) {
            console.error("AUDIT: Persistence Failure", e);
        }
    }

    _load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("AUDIT: Load Failure", e);
            return null;
        }
    }

    _generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
