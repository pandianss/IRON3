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
    MODULE_ACTIVATED: 'MODULE_ACTIVATED' // Added
};

// Schema Validation (Stub for MVP)
const RequiredPayloads = {
    [EventTypes.SESSION_INTENT]: ['contractId'],
    [EventTypes.SESSION_STARTED]: ['venue'],
    [EventTypes.SESSION_ENDED]: ['tags', 'evidence'],
    [EventTypes.EVIDENCE_SUBMITTED]: ['venue', 'evidenceType'],
    [EventTypes.MODULE_ACTIVATED]: ['moduleId']
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
