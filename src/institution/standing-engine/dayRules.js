import { StandingState } from './types.js';

/**
 * Returns the obligations required for a specific state.
 * @param {import('./types').StandingState} state
 * @returns {string[]} List of obligation IDs
 */
export function getObligations(state) {
    switch (state) {
        case StandingState.PRE_INDUCTION:
        case StandingState.INDUCTED:
            return ['DAILY_BRIEFING', 'DAILY_PRACTICE'];

        case StandingState.COMPLIANT:
        case StandingState.INSTITUTIONAL:
        case StandingState.RECONSTITUTED:
            return ['DAILY_PRACTICE'];

        case StandingState.STRAINED:
        case StandingState.BREACH_RISK:
            return ['IMMEDIATE_CORRECTION'];

        case StandingState.VIOLATED:
            return ['ACKNOWLEDGE_FRACTURE', 'ENTER_RECOVERY'];

        case StandingState.RECOVERY:
            return ['REDUCED_PRACTICE', 'INTENTION_SETTING'];

        default:
            return [];
    }
}
