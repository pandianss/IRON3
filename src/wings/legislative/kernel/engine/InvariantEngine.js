import { INVARIANTS } from './data/invariants.js';

/**
 * Invariant Engine
 * Role: The Internal Auditor.
 * Responsibility: Continuously verify that the Institutional State adheres to defined Invariants.
 */
export class InvariantEngine {
    constructor(kernel) {
        this.kernel = kernel;
        this.invariants = INVARIANTS;
        this.history = [];
    }

    /**
     * Runs a full verification suite against the current kernel state.
     * @returns {object} Verification Result
     */
    verifySnapshot() {
        const snapshot = this.kernel.getSnapshot();
        const context = {
            state: snapshot.state,
            ledger: snapshot.history,
            activeModules: snapshot.activeModules,
            previousSnapshot: this.lastSnapshot || null
        };

        const results = this.invariants.map(invariant => {
            let passed = false;
            try {
                passed = invariant.check(context);
            } catch (e) {
                console.error(`VVL: Invariant Check Failed [${invariant.id}]`, e);
                passed = false;
            }

            return {
                id: invariant.id,
                severity: invariant.severity,
                passed,
                timestamp: new Date().toISOString()
            };
        });

        // Store snapshot for differential checks (like monotonicity)
        this.lastSnapshot = snapshot;

        const failures = results.filter(r => !r.passed);
        const report = {
            timestamp: new Date().toISOString(),
            totalChecks: results.length,
            passed: results.length - failures.length,
            failed: failures.length,
            status: failures.length > 0 ? 'CONSTITUTIONAL_CRISIS' : 'NOMINAL',
            details: results
        };

        this.history.push(report);
        return report;
    }

    /**
     * Diagnostics: Get the audit history.
     */
    getAuditLog() {
        return this.history;
    }
}
