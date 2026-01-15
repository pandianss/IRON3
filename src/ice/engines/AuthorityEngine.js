/**
 * ICE Module 7: Authority Engine
 * Role: The Governor.
 * Responsibilities:
 * - Resolve Permissions based on Standing and Contracts.
 * - Compute Locks.
 * - Enforce Interaction Constraints.
 */
export class AuthorityEngine {
    constructor(kernel) {
        this.kernel = kernel;
    }

    /**
     * cycle() step: Re-calculates authority profile based on current state.
     */
    resolveAuthority() {
        // 1. Get Inputs
        const standing = this.kernel.state.getDomain('standing');
        const activeContracts = this.kernel.engines.contract.activeContracts; // Set of IDs

        // 2. Default Policy (Restrictive)
        let profile = {
            locks: [],
            surfaces: {
                'OBLIGATION_CORRIDOR': 'RESTRICTED',
                'EVIDENCE_CAPTURE': 'HIDDEN',
                'LEDGER_CLOSURE': 'HIDDEN'
            }
        };

        // 3. Apply Standing Rules (The Constitution)
        if (standing.state === 'PRE_INDUCTION') {
            // Only Induction is open (not modeled in ICE yet, assumed external or via contract)
        } else if (standing.state === 'VIOLATED') {
            // FRACTURE LOCKOUT
            profile.locks.push({ class: 'SURFACE', level: 'TOTAL', reason: 'FRACTURE' });
        } else {
            // COMPLIANT / INDUCTED
            profile.surfaces['OBLIGATION_CORRIDOR'] = 'FULL';
        }

        // 3.5 Session Override
        const session = this.kernel.state.getDomain('session');
        if (session && (session.status === 'ACTIVE' || session.status === 'PENDING')) {
            profile.surfaces['EVIDENCE_CAPTURE'] = 'FULL';
            profile.surfaces['OBLIGATION_CORRIDOR'] = 'HIDDEN'; // Focus Mode
        }

        // 4. Apply Contract Effects (The Law)
        // Iterate active contracts and apply 'authorityEffects' (onActivation)
        // This is complex. For MVP, we'll check Obligations.
        const obligations = this.kernel.engines.contract.getActiveObligations();
        const hasPendingPractice = obligations.some(o => o.requiredEvent === 'SESSION_ENDED');

        if (hasPendingPractice) {
            profile.surfaces['OBLIGATION_CORRIDOR'] = 'FULL';
        }

        // 5. Update State
        this.kernel.state.update('authority', profile);
        console.log("ICE: Authority Resolved", profile);
    }
}
