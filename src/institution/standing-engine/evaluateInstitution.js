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

    // 2. Determine Obligations & Daily Status (The "Now" Check)
    let obligations = getObligations(standing.state);

    // Check if today's obligations are met
    const today = now.split('T')[0];
    const todaysEvents = ledger.filter(e => e.timestamp.startsWith(today));

    const practiceDone = todaysEvents.some(e => e.type === 'PRACTICE_COMPLETE');
    const restDone = todaysEvents.some(e => e.type === 'REST_TAKEN');

    if (practiceDone || restDone) {
        obligations = obligations.filter(o => o !== 'DAILY_PRACTICE');
    }

    // 3. Determine Required Surface
    // Default: If obligations exist, show Corridor. Else, System State.
    let requiredSurface = { id: SurfaceId.SYSTEM_STATE, props: {} };

    switch (standing.state) {
        case StandingState.PRE_INDUCTION:
            requiredSurface = { id: SurfaceId.INDUCTION, props: { day: 1 } };
            break;

        case StandingState.VIOLATED:
            requiredSurface = { id: SurfaceId.CONSEQUENCE_HALL, props: { reason: "Fracture Detected" } };
            break;

        case StandingState.RECOVERY:
            // Recovery allows practice, so check obligations
            if (obligations.includes('REDUCED_PRACTICE') && !practiceDone) {
                requiredSurface = { id: SurfaceId.OBLIGATION_CORRIDOR, props: { mode: 'RECOVERY' } };
            } else {
                requiredSurface = { id: SurfaceId.SYSTEM_STATE, props: { mode: 'RECOVERY' } };
            }
            break;

        case StandingState.INDUCTED:
            // Special Case: Day 1 Induction
            // If we just Inducted (Protocol Created), we still need to practice?
            // "Required outcome: first governed day must resolve."
            if (obligations.length > 0) {
                requiredSurface = { id: SurfaceId.OBLIGATION_CORRIDOR, props: {} };
            }
            break;

        case StandingState.COMPLIANT:
        case StandingState.RECONSTITUTED:
        case StandingState.INSTITUTIONAL:
        case StandingState.STRAINED:
        case StandingState.BREACH_RISK:
            if (obligations.length > 0) {
                requiredSurface = { id: SurfaceId.OBLIGATION_CORRIDOR, props: {} };
            } else {
                requiredSurface = { id: SurfaceId.SYSTEM_STATE, props: {} };
            }
            break;
    }

    return {
        standing,
        obligations,
        scars,
        eras,
        currentEra,
        violations: [],
        requiredSurface
    };
}
