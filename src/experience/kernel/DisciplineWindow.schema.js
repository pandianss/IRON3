/**
 * DISCIPLINE WINDOW SCHEMA (DISCIPLINE-WINDOW-01)
 * Canonical states and transition rules for the institutional temporal witness.
 */

export const WINDOW_STATES = Object.freeze({
    IDLE: "idle",               // No observation active
    PRIMED: "primed",           // Ritual entered, awaiting Before Selfie
    OPEN: "open",               // Window instantiated (momentary)
    ACTIVE: "active",           // Institutional observation in progress
    INTERRUPTED: "interrupted", // Temporal continuity disrupted
    EXPIRED: "expired",         // Maximum duration exceeded
    CLOSED_VALID: "closed_valid", // Candidate valid closure
    CLOSED_INVALID: "closed_invalid", // Constitutionally unfit closure
    SEALED: "sealed"            // Immutable archive record
});

export const VALIDITY_STATUS = Object.freeze({
    SUSTAINED: "sustained",
    DEGRADED: "degraded",
    INSUFFICIENT: "insufficient",
    EXPIRED: "expired",
    ABORTED: "aborted"
});

export const WINDOW_CONSTRAINTS = Object.freeze({
    MIN_DURATION_MS: 300 * 1000,    // 5 minutes
    MAX_DURATION_MS: 120 * 60 * 1000, // 2 hours
    MAX_INTERRUPTIONS: 3,
    MAX_INTERRUPTION_TIME_MS: 300 * 1000 // 5 minutes cumulative
});

/**
 * Validates a state transition according to the Formal Logical Diagram.
 */
export function canTransition(currentState, nextState) {
    const transitions = {
        [WINDOW_STATES.IDLE]: [WINDOW_STATES.PRIMED],
        [WINDOW_STATES.PRIMED]: [WINDOW_STATES.OPEN],
        [WINDOW_STATES.OPEN]: [WINDOW_STATES.ACTIVE],
        [WINDOW_STATES.ACTIVE]: [
            WINDOW_STATES.INTERRUPTED,
            WINDOW_STATES.CLOSED_VALID,
            WINDOW_STATES.CLOSED_INVALID,
            WINDOW_STATES.EXPIRED
        ],
        [WINDOW_STATES.INTERRUPTED]: [
            WINDOW_STATES.ACTIVE,
            WINDOW_STATES.CLOSED_INVALID,
            WINDOW_STATES.EXPIRED
        ],
        [WINDOW_STATES.EXPIRED]: [WINDOW_STATES.CLOSED_INVALID],
        [WINDOW_STATES.CLOSED_VALID]: [WINDOW_STATES.SEALED],
        [WINDOW_STATES.CLOSED_INVALID]: [WINDOW_STATES.SEALED],
        [WINDOW_STATES.SEALED]: [] // No exits from Sealed
    };

    return transitions[currentState]?.includes(nextState) || false;
}
