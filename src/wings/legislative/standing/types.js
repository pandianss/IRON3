/**
 * STANDING TYPES
 * Defines the canonical states for Institutional Standing.
 */

export const StandingState = Object.freeze({
    PRE_INDUCTION: "PRE_INDUCTION",
    INDUCTED: "INDUCTED",
    COMPLIANT: "COMPLIANT",
    STRAINED: "STRAINED",
    BREACH_RISK: "BREACH_RISK",
    VIOLATED: "VIOLATED",
    RECOVERY: "RECOVERY",
    RECONSTITUTED: "RECONSTITUTED",
    INSTITUTIONAL: "INSTITUTIONAL"
});

/**
 * @typedef {Object} Standing
 * @property {string} state - One of StandingState
 * @property {number} streak - Consecutive compliant days
 * @property {number} entropy - 0-100 system disorder
 * @property {string} lastPracticeDate - ISO date string
 */
