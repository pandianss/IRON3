/**
 * ICE Module 3: Memory Ledger
 * Role: The Institutional Conscience (Source of Truth).
 * Guarantees: Append-only, Immutable, Replayable.
 */
export class MemoryLedger {
    constructor(initialEvents = []) {
        this._log = [...initialEvents];
        this._sealed = false;
    }

    /**
     * Appends a canonical event to the record.
     * @param {object} event - Validated InstitutionalEvent
     */
    append(event) {
        if (this._sealed) {
            throw new Error("ICE Violation: Ledger is Sealed.");
        }
        // Deep Freeze or Copy to ensure immutability
        const entry = Object.freeze({ ...event });
        this._log.push(entry);
        return entry;
    }

    /**
     * Returns the full history for replay.
     */
    getHistory() {
        return [...this._log];
    }

    /**
     * Returns the size of the ledger.
     */
    get size() {
        return this._log.length;
    }

    /**
     * Queries the ledger for specific criteria.
     * @param {function} predicate 
     */
    query(predicate) {
        return this._log.filter(predicate);
    }
}
