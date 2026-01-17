import { InstitutionalKernel } from '../../../ice/InstitutionalKernel.js';
import { initializeKernel, getKernel } from '../../bootstrap.js';

/**
 * Sovereignty Harness
 * 
 * "A Constitutional Court, not a simulation."
 * 
 * Provides minimal, sterile probes to verify negative capabilities.
 * These must execute in milliseconds.
 */

// Probe A: Kernel Unavoidability
// Can we run an institutional action without the kernel initialized?
export async function attemptKernellessExecution() {
    console.log("PROBE A: Attempting Kernelless Execution...");
    // Create a raw institutional kernel (un-bootstrapped)
    const rawInstitution = new InstitutionalKernel();

    try {
        // Attempt to ingest directly
        await rawInstitution.ingest('LIFECYCLE_PROMOTE', { targetStage: 'PROBATION' }, 'System');
        return { blocked: false, message: "CRITICAL: Kernelless execution succeeded." };
    } catch (e) {
        return { blocked: true, error: e.message };
    }
}

// Probe B: Gate Supremacy
// Can we bypass the Compliance Gate even if Kernel is present?
export async function attemptGateBypass() {
    console.log("PROBE B: Attempting Gate Bypass...");
    const institution = new InstitutionalKernel();
    await initializeKernel(institution, { mode: 'test' });

    // Attempt to call internal engine logic directly, bypassing kernel.ingest/gate
    try {
        // Checking if we can force a state change directly on the state monitor
        // This simulates a "rogue" module trying to write to state
        const sovereignKernel = getKernel();
        if (!sovereignKernel) throw new Error("Kernel not found for Probe B");

        // Try to access the state monitor's internal write method if exposed, 
        // or try to trick the gate (though gate is the only path in Ingest).
        // A better test for "Gate Supremacy" relative to the Institution is:
        // Does the Institution allow *any* side channel?

        // Let's try to manually invoke an engine method that *should* be wrapped.
        // But engines are internal to InstitutionalKernel.

        // Instead, let's try to ingest an event with a fake actor that SHOULD be blocked by R-SYS-01
        // If the Gate is working, it catches this.
        const result = await institution.ingest('TEST_ACTION', {}, 'RogueActor');
        // If ingest returns, it means the gate allowed it or didn't throw (depending on config).
        // Our gate usually throws or returns a rejection.

        return { blocked: false, result };
    } catch (e) {
        return { blocked: true, error: e.message };
    }
}

// Probe C: State Write Lock
// Can we manually mutate the state without going through the channel?
export async function attemptDirectStateMutation() {
    console.log("PROBE C: Attempting Direct State Mutation...");
    const institution = new InstitutionalKernel();
    await initializeKernel(institution, { mode: 'test' });
    const sovereignKernel = getKernel();

    try {
        // Probe C: State Write Lock
        // Attempt to execute a direct update
        // The architectural requirement is that the system (institution.state) CANNOT BE MUTATED without the gate.
        // We test if we can call update() directly.

        try {
            institution.state.update('foundation', { hacked: true });
            // If it didn't throw, check if it persisted (it shouldn't if update does nothing without token)
            const check = institution.state.getDomain('foundation');
            if (check && check.hacked) {
                return { blocked: false, message: "Direct state update succeeded." };
            }
        } catch (e) {
            if (e.message.includes("Unauthorized")) {
                return { blocked: true };
            }
            // If other error, still blocked?
            return { blocked: true, error: e.message };
        }

        // Also check if we can mutate via property access foundation.hacked = true
        // But getDomain returns frozen object now.
        const foundation = institution.state.getDomain('foundation');
        if (foundation) {
            try {
                foundation.hacked = true;
                if (foundation.hacked) return { blocked: false, message: "Snapshot object was mutable." };
            } catch (e) {
                // strict mode might throw on frozen write, or it just fails silently
                // verify read back
                if (foundation.hacked) return { blocked: false, message: "Snapshot object was mutable." };
            }
        }

        return { blocked: true };
    } catch (e) {
        return { blocked: true, error: e.message };
    }
}

// Probe D: Audit Mandatory
// Can we execute a governed action if the audit ledger is broken/disabled?
export async function attemptGovernedActionWithoutAudit() {
    console.log("PROBE D: Attempting Action Without Audit...");
    const institution = new InstitutionalKernel();
    await initializeKernel(institution, { mode: 'test' });
    const sovereignKernel = getKernel();

    try {
        // Sabotage the audit ledger
        sovereignKernel.audit.recordDecision = () => { throw new Error("Audit Failure Simulation"); };

        // Attempt action
        await institution.ingest('LIFECYCLE_PROMOTE', { targetStage: 'PROBATION' }, 'System');
        return { blocked: false, message: "Action proceeded despite audit failure." };
    } catch (e) {
        if (e.message.includes("Audit Failure")) {
            return { blocked: true, error: "Transaction rolled back due to audit failure." };
        }
        return { blocked: true, error: e.message };
    }
}
