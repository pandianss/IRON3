/**
 * Harness Module: Invariant Engine
 * Role: Validates Institutional Truths (The Laws of Physics).
 * If an Invariant fails, the simulation (and the engine) is broken.
 */

export class InvariantEngine {
    constructor() {
        this.failures = [];
    }

    /**
     * Checks all invariants against a snapshot.
     * @param {number} tick 
     * @param {object} snapshot - { state, mandates }
     */
    check(tick, snapshot) {
        this.checkMandateConsistency(tick, snapshot);
        this.checkStandingIntegrity(tick, snapshot);
    }

    checkMandateConsistency(tick, snapshot) {
        const state = snapshot.state.standing.state;
        const tone = snapshot.mandates.narrative.tone;

        // Law: VIOLATED => ALARM
        if (state === 'VIOLATED' && tone !== 'ALARM') {
            this.fail(tick, `Invariant Breach: VIOLATED state must produce ALARM tone. Got: ${tone}`);
        }
    }

    checkStandingIntegrity(tick, snapshot) {
        const integrity = snapshot.state.standing.integrity;

        // Law: Integrity Bound [0, 100]
        if (integrity < 0 || integrity > 100) {
            this.fail(tick, `Invariant Breach: Integrity out of bounds (${integrity})`);
        }
    }

    fail(tick, reason) {
        console.error(`HARNESS: [Invariant Failure @ T=${tick}] ${reason}`);
        this.failures.push({ tick, reason });
    }

    getReport() {
        return {
            passed: this.failures.length === 0,
            failures: this.failures
        };
    }
}
