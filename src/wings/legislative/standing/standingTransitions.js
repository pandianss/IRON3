import { StandingState } from './types.js';

const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.toDateString() === date2.toDateString();
};

/** @typedef {import('./types').Standing} Standing */
/** @typedef {import('./types').BehaviorEvent} BehaviorEvent */

/**
 * Pure State Transition Function
 * Applies a behavioral event to the current standing to derive the new state.
 * 
 * @param {Standing} current - The current institutional standing.
 * @param {BehaviorEvent} event - The event that occurred.
 * @returns {Partial<Standing> | null} - The updates to apply to the standing (or null if no change).
 */
export function transition(current, event) {
    switch (current.state) {

        // 0. PRE-INDUCTION -> INDUCTED
        case StandingState.PRE_INDUCTION:
            // "CONTRACT_CREATED" or "GENESIS_VERDICT_SUBMITTED" (Simulation Induction)
            if (event === 'CONTRACT_CREATED' || event === 'GENESIS_VERDICT_SUBMITTED') {
                return { state: StandingState.INDUCTED, entropy: 0, streak: 0 };
            }
            break;

        // 1. INDUCTED (Trial Phase)
        case StandingState.INDUCTED:
            if (event === 'PRACTICE_COMPLETE' || event === 'SESSION_ENDED' || event === 'FIRST_COMPLIANCE' || event === 'TRAINING_COMPLETED') {
                // Check Idempotency
                if (isSameDay(current.lastPracticeDate, new Date())) {
                    // Already practiced today. No streak change.
                    return { lastPracticeDate: new Date().toISOString() };
                }
                // "FIRST_COMPLIANCE -> COMPLIANT"
                return { state: StandingState.COMPLIANT, entropy: 0, streak: 1, lastPracticeDate: new Date().toISOString() };
            }
            if (event === 'GENESIS_VERDICT_SUBMITTED') {
                // The institution is born. User is now a member on probation.
                return { state: StandingState.COMPLIANT, entropy: 0, streak: 0 };
            }
            if (event === 'PRACTICE_MISSED' || event === 'SESSION_MISSED') {
                // "FIRST_BREACH -> VIOLATED"
                // Strict law: First day failure in Induction is a Violation? 
                // Constitution says: "first governed day must resolve."
                // "FIRST_BREACH -> VIOLATED"
                return { state: StandingState.VIOLATED, entropy: 100, streak: 0 };
            }
            break;

        // 2, 7, 8. THE COMMITTED PATH (COMPLIANT / RECONSTITUTED / INSTITUTIONAL)
        case StandingState.COMPLIANT:
        case StandingState.RECONSTITUTED:
        case StandingState.INSTITUTIONAL:
            if (event === 'PRACTICE_COMPLETE' || event === 'SESSION_ENDED' || event === 'TRAINING_COMPLETED') {
                // Check Idempotency
                if (isSameDay(current.lastPracticeDate, new Date())) {
                    return { lastPracticeDate: new Date().toISOString() };
                }

                const newStreak = current.streak + 1;

                // Promotion Rule: 30 Days of COMPLIANT -> INSTITUTIONAL
                // Only if coming from COMPLIANT (not Reconstituted? Constitution is vague, implies "Long-standing members")
                // "LONG_CONTINUITY -> INSTITUTIONAL"
                if (current.state === StandingState.COMPLIANT && newStreak >= 30) {
                    return { state: StandingState.INSTITUTIONAL, entropy: 0, streak: newStreak, lastPracticeDate: new Date().toISOString() };
                }
                return { streak: newStreak, entropy: 0, lastPracticeDate: new Date().toISOString() };
            }
            if (event === 'REST_TAKEN' || event === 'REST_OBSERVED' || event === 'RECOVERY_COMPLETED') {
                // Authorized rest maintains streak but adds no count.
                // Reset entropy.
                return { entropy: 0 };
            }
            if (event === 'PRACTICE_MISSED' || event === 'SESSION_MISSED') {
                // TUNE: Soft Failure.
                // Instead of immediate Violation, we enter STRAINED state.
                // "SOFT_FAILURE -> STRAINED"
                return { state: StandingState.STRAINED, entropy: 50, streak: current.streak };
            }
            break;

        // 3. STRAINED (Warning State)
        case StandingState.STRAINED:
            if (event === 'PRACTICE_COMPLETE' || event === 'SESSION_ENDED') {
                // "RECOVERY_COMPLIANCE -> COMPLIANT"
                return { state: StandingState.COMPLIANT, entropy: 0, streak: current.streak + 1 };
            }
            if (event === 'PRACTICE_MISSED') {
                // "CONTINUED_DEGRADATION -> BREACH_RISK" or "HARD_FAILURE -> VIOLATED"
                return { state: StandingState.VIOLATED, entropy: 100, streak: 0 };
            }
            break;

        // 5. VIOLATED (FRACTURED)
        case StandingState.VIOLATED:
            // "ACCEPT_RECOVERY -> RECOVERY"
            if (event === 'ENTER_RECOVERY' || event === 'ACCEPT_RECOVERY') {
                return { state: StandingState.RECOVERY, entropy: 50 };
            }
            break;

        // 6. RECOVERY
        case StandingState.RECOVERY:
            if (event === 'PRACTICE_COMPLETE' || event === 'SESSION_ENDED') {
                const newStreak = current.streak + 1;
                // "RECOVERY_COMPLETED -> RECONSTITUTED"
                // Rule: 3 Days of Recovered Practice
                if (newStreak >= 3) {
                    return { state: StandingState.RECONSTITUTED, entropy: 0, streak: newStreak };
                }
                return { streak: newStreak, entropy: Math.max(0, current.entropy - 20) };
            }
            if (event === 'PRACTICE_MISSED') {
                // "RECOVERY_FAILED -> VIOLATED"
                return { state: StandingState.VIOLATED, entropy: 100 };
            }
            break;

        // 4. BREACH_RISK
        case StandingState.BREACH_RISK:
            if (event === 'PRACTICE_COMPLETE' || event === 'SESSION_ENDED') {
                // "EMERGENCY_COMPLIANCE -> STRAINED" (or Compliant)
                return { state: StandingState.STRAINED, entropy: 50, streak: current.streak };
            }
            if (event === 'PRACTICE_MISSED') {
                // "WINDOW_EXPIRED -> VIOLATED"
                return { state: StandingState.VIOLATED, entropy: 100 };
            }
            break;
    }

    // Global Events (Apply to any state)
    if (event === 'AUTHORITY_REALIGNED') {
        // Increment entropy by 20 (Penalty for terminal incoherence)
        return { entropy: Math.min(100, current.entropy + 20) };
    }

    return null; // No state change
}
