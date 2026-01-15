import { StandingState } from './types.js';

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
            // "CONTRACT_CREATED"
            if (event === 'CONTRACT_CREATED') {
                return { state: StandingState.INDUCTED, entropy: 0, streak: 0 };
            }
            break;

        // 1. INDUCTED (Trial Phase)
        case StandingState.INDUCTED:
            if (event === 'PRACTICE_COMPLETE' || event === 'FIRST_COMPLIANCE') {
                // "FIRST_COMPLIANCE -> COMPLIANT"
                return { state: StandingState.COMPLIANT, entropy: 0, streak: 1 };
            }
            if (event === 'PRACTICE_MISSED') {
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
            if (event === 'PRACTICE_COMPLETE') {
                const newStreak = current.streak + 1;

                // Promotion Rule: 30 Days of COMPLIANT -> INSTITUTIONAL
                // Only if coming from COMPLIANT (not Reconstituted? Constitution is vague, implies "Long-standing members")
                // "LONG_CONTINUITY -> INSTITUTIONAL"
                if (current.state === StandingState.COMPLIANT && newStreak >= 30) {
                    return { state: StandingState.INSTITUTIONAL, entropy: 0, streak: newStreak };
                }
                return { streak: newStreak, entropy: 0 };
            }
            if (event === 'REST_TAKEN') {
                // Authorized rest maintains streak but adds no count.
                // Reset entropy.
                return { entropy: 0 };
            }
            if (event === 'PRACTICE_MISSED') {
                // "HARD_FAILURE -> VIOLATED"
                // Or "SOFT_FAILURE -> STRAINED". 
                // For MVP Strictness: A miss is a HARD FAILURE unless defined as Soft.
                // Let's implement Strict MVP: Miss = Violated.
                // Wait, Constitution says "SOFT_FAILURE -> STRAINED". 
                // Let's assume PRACTICE_MISSED is HARD for now (no soft logic yet).
                return { state: StandingState.VIOLATED, entropy: 100, streak: 0 };
            }
            break;

        // 3. STRAINED (Warning State)
        case StandingState.STRAINED:
            if (event === 'PRACTICE_COMPLETE') {
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
            if (event === 'PRACTICE_COMPLETE') {
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
            if (event === 'PRACTICE_COMPLETE') {
                // "EMERGENCY_COMPLIANCE -> STRAINED" (or Compliant)
                return { state: StandingState.STRAINED, entropy: 50, streak: current.streak };
            }
            if (event === 'PRACTICE_MISSED') {
                // "WINDOW_EXPIRED -> VIOLATED"
                return { state: StandingState.VIOLATED, entropy: 100 };
            }
            break;
    }

    return null; // No state change
}
