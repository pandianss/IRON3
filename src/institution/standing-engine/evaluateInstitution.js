import { transition } from './standingTransitions.js';
import { getObligations } from './dayRules.js';
import { StandingState, SurfaceId } from './types.js';
import { Eras } from '../../domain/Eras.js';
import { Scars } from '../../domain/Scars.js';

/** @typedef {import('./types').InstitutionalState} InstitutionalState */
/** @typedef {import('./types').BehaviorEvent} BehaviorEvent */

/**
 * The Standing Engine Core.
 * Evaluates the pure state of the institution for a user.
 * 
 * @param {Array<{type: BehaviorEvent, timestamp: string, payload?: any}>} ledger - The history of actions.
 * @param {string} now - ISO timestamp of the current moment.
 * @returns {InstitutionalState}
 */
export function evaluateInstitution(ledger, now) {
    // 1. Replay History
    let standing = {
        state: StandingState.PRE_INDUCTION,
        entropy: 0,
        streak: 0,
        since: ledger[0]?.timestamp || new Date().toISOString()
    };

    let scars = { fractures: 0, recoveries: 0, history: [], list: [] };
    let eras = [];
    let currentEra = null;

    for (const event of ledger) {
        const previousState = standing.state;
        const result = transition(standing, event.type);

        if (result) {
            const newState = result.state || standing.state;

            // ERA MANAGEMENT LOGIC
            // 1. Start Era: Entering INDUCTED (Era 1) or RECONSTITUTED (Era N)
            const enteringInduction = previousState === StandingState.PRE_INDUCTION && newState === StandingState.INDUCTED;
            const enteringReconstituted = previousState === StandingState.RECOVERY && newState === StandingState.RECONSTITUTED;

            if (enteringInduction || enteringReconstituted) {
                const eraIndex = eras.length + 1;
                currentEra = Eras.start(event.timestamp, eraIndex);
                eras.push(currentEra);
            }

            // 2. Close Era: Entering VIOLATED
            if (newState === StandingState.VIOLATED && previousState !== StandingState.VIOLATED) {
                if (currentEra && currentEra.status === 'ACTIVE') {
                    // Close it
                    currentEra = Eras.close(currentEra, event.timestamp);
                    eras[eras.length - 1] = currentEra; // Update in array

                    // Add Scar
                    const scar = Scars.create('FRACTURE', event.timestamp, currentEra.id);
                    scars.list.push(scar);
                }
                scars.fractures++;
            }

            // 3. Recovery Scars
            if (previousState === StandingState.RECOVERY && (newState === StandingState.RECONSTITUTED || newState === StandingState.COMPLIANT)) {
                scars.recoveries++;
            }

            // General History Log
            if (newState !== previousState) {
                scars.history.push([previousState, newState, event.timestamp]);
                standing.since = event.timestamp;
            }

            standing = { ...standing, ...result };
        }
    }

    // 2. Determine Obligations & Status
    let obligations = getObligations(standing.state);

    const today = now.split('T')[0];
    const todaysEvents = ledger.filter(e => e.timestamp.startsWith(today));

    const practiceDeclared = todaysEvents.some(e => e.type === 'PRACTICE_COMPLETE');
    const evidenceSubmitted = todaysEvents.some(e => e.type === 'EVIDENCE_SUBMITTED');
    const dayAcknowledged = todaysEvents.some(e => e.type === 'CONTINUE_CYCLE');
    const restDone = todaysEvents.some(e => e.type === 'REST_TAKEN');

    // Obligation is met if Evidence Submitted or Rest Taken
    if (evidenceSubmitted || restDone) {
        obligations = obligations.filter(o => o !== 'DAILY_PRACTICE');
    }

    // 3. Determine Required Surface
    let requiredSurface = { id: SurfaceId.SYSTEM_STATE, props: {} };

    // A. PRE_INDUCTION
    if (standing.state === StandingState.PRE_INDUCTION) {
        return { ...baseResult(standing, obligations, scars, eras, currentEra), requiredSurface: { id: SurfaceId.INDUCTION, props: { day: 1 } } };
    }

    // B. VIOLATED
    if (standing.state === StandingState.VIOLATED) {
        return { ...baseResult(standing, obligations, scars, eras, currentEra), requiredSurface: { id: SurfaceId.CONSEQUENCE_HALL, props: { reason: "Fracture Detected" } } };
    }

    // C. DAILY FLOW (Inducted/Compliant/etc)
    // 1. If Practice Declared but No Evidence -> CAPTURE EVIDENCE
    if (practiceDeclared && !evidenceSubmitted) {
        return {
            ...baseResult(standing, obligations, scars, eras, currentEra),
            requiredSurface: { id: SurfaceId.EVIDENCE_CAPTURE, props: {} }
        };
    }

    // 2. If Evidence Submitted but Not Acknowledged -> DAILY VERDICT
    if (evidenceSubmitted && !dayAcknowledged) {
        return {
            ...baseResult(standing, obligations, scars, eras, currentEra),
            requiredSurface: { id: SurfaceId.LEDGER_CLOSURE, props: {} }
        };
    }

    // 3. Recovery Special Logic
    if (standing.state === StandingState.RECOVERY) {
        if (obligations.includes('REDUCED_PRACTICE') && !evidenceSubmitted) {
            return { ...baseResult(standing, obligations, scars, eras, currentEra), requiredSurface: { id: SurfaceId.OBLIGATION_CORRIDOR, props: { mode: 'RECOVERY' } } };
        }
    }

    // 4. Standard Obligation
    if (obligations.length > 0) {
        return { ...baseResult(standing, obligations, scars, eras, currentEra), requiredSurface: { id: SurfaceId.OBLIGATION_CORRIDOR, props: {} } };
    }

    // 5. Default -> SYSTEM STATE (Obligation Hall)
    // return default...
    return { ...baseResult(standing, obligations, scars, eras, currentEra), requiredSurface: { id: SurfaceId.SYSTEM_STATE, props: {} } };
}

function baseResult(standing, obligations, scars, eras, currentEra) {
    return { standing, obligations, scars, eras, currentEra, violations: [] };
}
