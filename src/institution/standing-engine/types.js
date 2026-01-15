/**
 * @typedef {'PRE_INDUCTION' | 'INDUCTED' | 'COMPLIANT' | 'STRAINED' | 'BREACH_RISK' | 'VIOLATED' | 'RECOVERY' | 'RECONSTITUTED' | 'INSTITUTIONAL'} StandingState
 */

/**
 * @typedef {'CONTRACT_CREATED' | 'FIRST_COMPLIANCE' | 'FIRST_BREACH' | 'OBLIGATION_MET' | 'SOFT_FAILURE' | 'HARD_FAILURE' | 'LONG_CONTINUITY' | 'RECOVERY_COMPLIANCE' | 'CONTINUED_DEGRADATION' | 'EMERGENCY_COMPLIANCE' | 'WINDOW_EXPIRED' | 'ACCEPT_RECOVERY' | 'EXIT_INSTITUTION' | 'RECOVERY_COMPLETED' | 'RECOVERY_FAILED' | 'SUSTAINED_COMPLIANCE' | 'RELAPSE' | 'MAINTAINED_AUTHORITY' | 'FAILURE'} TransitionEvent
 */

/**
 * @typedef {'PRACTICE_COMPLETE' | 'REST_TAKEN' | 'PRACTICE_MISSED' | 'ENTER_RECOVERY'} LegacyBehaviorEvent
 * @typedef {TransitionEvent | LegacyBehaviorEvent} BehaviorEvent
 */

/**
 * @typedef {Object} Standing
 * @property {StandingState} state - The current authority state.
 * @property {number} entropy - Accumulating decay (0-100).
 * @property {number} streak - Consecutive days of valid practice.
 * @property {number} since - Timestamp (ISO) of when this state was entered.
 */

/**
 * @typedef {Object} Scars
 * @property {number} fractures - Total fracture count (VIOLATED states).
 * @property {number} recoveries - Total recovery count (RECOVERING states).
 * @property {string[]} history - List of past state transitions [state, date].
 */

/**
 * @typedef {Object} Violation
 * @property {string} id - Unique ID.
 * @property {string} type - 'MISSED_PRACTICE' | 'INVALID_ACTION'.
 * @property {string} date - ISO Date.
 * @property {boolean} acknowledged - Has the user seen this?
 */

/**
 * @typedef {Object} RequiredSurface
 * @property {'SYSTEM_STATE' | 'OBLIGATION_CORRIDOR' | 'EVIDENCE_CAPTURE' | 'LEDGER_CLOSURE' | 'CONSEQUENCE_HALL' | 'INDUCTION'} id
 * @property {Object} props - Data needed to render the surface.
 */

/**
 * @typedef {Object} InstitutionalState
 * @property {Standing} standing
 * @property {string[]} obligations - List of required actions today.
 * @property {Scars} scars
 * @property {Violation[]} violations
 * @property {RequiredSurface} requiredSurface
 */

export const StandingState = {
    PRE_INDUCTION: 'PRE_INDUCTION', // 0
    INDUCTED: 'INDUCTED',           // 1
    COMPLIANT: 'COMPLIANT',         // 2
    STRAINED: 'STRAINED',           // 3
    BREACH_RISK: 'BREACH_RISK',     // 4
    VIOLATED: 'VIOLATED',           // 5 (Ex-FRACTURED)
    RECOVERY: 'RECOVERY',           // 6
    RECONSTITUTED: 'RECONSTITUTED', // 7 (New)
    INSTITUTIONAL: 'INSTITUTIONAL'  // 8 (New)
};

export const SurfaceId = {
    SYSTEM_STATE: 'SYSTEM_STATE',
    OBLIGATION_CORRIDOR: 'OBLIGATION_CORRIDOR',
    EVIDENCE_CAPTURE: 'EVIDENCE_CAPTURE',
    LEDGER_CLOSURE: 'LEDGER_CLOSURE',
    CONSEQUENCE_HALL: 'CONSEQUENCE_HALL',
    INDUCTION: 'INDUCTION'
};
