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
        const phase = this.kernel.state.getDomain('phase')?.id || 'GENESIS';

        let profile = {
            locks: [],
            surfaces: {
                'OBLIGATION_CORRIDOR': 'RESTRICTED',
                'EVIDENCE_CAPTURE': 'HIDDEN',
                'LEDGER_CLOSURE': 'HIDDEN',
                'OBSERVATORY': 'VISIBLE'
            }
        };

        // Phase Overrides
        if (phase === 'GENESIS') {
            profile.surfaces['OBLIGATION_CORRIDOR'] = 'HIDDEN';
            profile.interactionLevel = 'OBSERVATIONAL';
        }

        if (phase === 'PROBATION') {
            profile.surfaces['OBLIGATION_CORRIDOR'] = 'FULL';
            profile.interactionLevel = 'CALIBRATION';
        }

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

        // 3.5 Protocol/Session Override
        const session = this.kernel.state.getDomain('session');
        if (session && (session.status === 'ACTIVE' || session.status === 'PENDING')) {
            profile.surfaces['EVIDENCE_CAPTURE'] = 'FULL';
            profile.surfaces['OBLIGATION_CORRIDOR'] = 'HIDDEN'; // Focus Mode
        }

        // 4. Apply Contract Effects (The Law)
        const obligations = this.kernel.engines.contract.getActiveObligations();
        const hasPendingObligations = obligations.length > 0;

        if (hasPendingObligations) {
            profile.surfaces['OBLIGATION_CORRIDOR'] = 'FULL';
        }

        // 5. Update State (Governed)
        const action = {
            type: 'AUTHORITY_UPDATE_PROFILE',
            payload: profile,
            actor: 'AuthorityEngine',
            rules: ['R-AUTH-01']
        };

        this.kernel.complianceKernel.getGate().govern(action, () => {
            this.kernel.setState('authority', profile);
            console.log("ICE: Authority Resolved & Governed", profile);
        }).catch(e => {
            console.error("ICE: Authority Resolution Blocked by Constitution", e.message);
        });
    }
}
