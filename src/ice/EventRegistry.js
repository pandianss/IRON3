/**
 * ICE Module 2: Event Registry
 * Role: Input Validator and Normalizer.
 * Only valid events may pass into the Kernel.
 */

// Canonical Event Types
export const EventTypes = {
    // Lifecycle
    CONTRACT_CREATED: 'CONTRACT_CREATED',
    SESSION_INTENT: 'SESSION_INTENT', // Added
    SESSION_STARTED: 'SESSION_STARTED',
    SESSION_ENDED: 'SESSION_ENDED',

    // Evidence
    EVIDENCE_SUBMITTED: 'EVIDENCE_SUBMITTED',

    // Status
    REST_TAKEN: 'REST_TAKEN',
    PRACTICE_MISSED: 'PRACTICE_MISSED', // System generated
    ENTER_RECOVERY: 'ENTER_RECOVERY',
    PRACTICE_COMPLETE: 'PRACTICE_COMPLETE', // Legacy/Direct Injection

    // Admin/Cycle
    CONTINUE_CYCLE: 'CONTINUE_CYCLE',
    MODULE_ACTIVATED: 'MODULE_ACTIVATED',
    MODULE_DEACTIVATED: 'MODULE_DEACTIVATED',
    AUTHORITY_REALIGNED: 'AUTHORITY_REALIGNED',

    // The Genesis: Institutional Birth (FC-00)
    BASELINE_DECLARED: 'BASELINE_DECLARED',
    CAPACITY_DECLARED: 'CAPACITY_DECLARED',
    INJURY_STATUS_DECLARED: 'INJURY_STATUS_DECLARED',
    CADENCE_SELECTED: 'CADENCE_SELECTED',
    GENESIS_VERDICT_SUBMITTED: 'GENESIS_VERDICT_SUBMITTED',
    INSTITUTION_BORN: 'INSTITUTION_BORN',
    INSTITUTION_ACTIVATED: 'INSTITUTION_ACTIVATED',

    // The Forge: Onboarding
    ASSESSMENT_COMPLETED: 'ASSESSMENT_COMPLETED',
    CALIBRATION_SET: 'CALIBRATION_SET',
    OATH_TAKEN: 'OATH_TAKEN',
    RESOLVE_COMMITTED: 'RESOLVE_COMMITTED',

    // Simulation / Fitness Specific
    TRAINING_COMPLETED: 'TRAINING_COMPLETED',
    RECOVERY_COMPLETED: 'RECOVERY_COMPLETED',
    INJURY_DECLARED: 'INJURY_DECLARED',
    DISHONEST_LOG: 'DISHONEST_LOG',
    SESSION_MISSED: 'SESSION_MISSED',
    REST_OBSERVED: 'REST_OBSERVED',
    DAILY_EVALUATION: 'DAILY_EVALUATION'
};

// Schema Validation (Stub for MVP)
const RequiredPayloads = {
    [EventTypes.SESSION_INTENT]: ['contractId'],
    [EventTypes.SESSION_STARTED]: ['venue'],
    [EventTypes.EVIDENCE_SUBMITTED]: ['venue', 'evidenceType'],
    [EventTypes.MODULE_ACTIVATED]: ['moduleId'],
    [EventTypes.MODULE_DEACTIVATED]: ['moduleId'],
    [EventTypes.ASSESSMENT_COMPLETED]: ['brokenPromise'],
    [EventTypes.CALIBRATION_SET]: ['startTime', 'anchorHabits'],
    [EventTypes.OATH_TAKEN]: ['nonNegotiable'],
    [EventTypes.RESOLVE_COMMITTED]: ['why', 'evidence'],
    [EventTypes.DAILY_EVALUATION]: ['day'],

    // FC-00 Specifics
    [EventTypes.BASELINE_DECLARED]: ['assessment'],
    [EventTypes.CAPACITY_DECLARED]: ['load'],
    [EventTypes.CADENCE_SELECTED]: ['cadence'],
    [EventTypes.GENESIS_VERDICT_SUBMITTED]: ['consent'],

    // Fitness Simulation Specifics
    [EventTypes.TRAINING_COMPLETED]: ['intensity', 'volume'],
    [EventTypes.RECOVERY_COMPLETED]: ['quality'],
    [EventTypes.DISHONEST_LOG]: ['fabricatedIntensity', 'actualLoad']
};

export class EventRegistry {
    constructor() {
        this.eventLog = [];
    }

    /**
     * Validates and Normalizes an incoming signal.
     * @param {string} type 
     * @param {object} payload 
     * @param {string} actorId 
     * @returns {object} Canonical InstitutionalEvent
     */
    static create(type, payload = {}, actorId) {
        if (!EventTypes[type]) {
            throw new Error(`ICE Violation: Illegal Event Type '${type}'`);
        }

        // Validate Payload
        const required = RequiredPayloads[type];
        if (required) {
            required.forEach(field => {
                if (payload[field] === undefined || payload[field] === null) {
                    throw new Error(`ICE Violation: Malformed Event '${type}'. Missing '${field}'.`);
                }
            });
        }

        return {
            id: generateId(),
            type,
            payload,
            meta: {
                actorId,
                timestamp: new Date().toISOString(),
                version: '1.0'
            }
        };
    }
}

function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
