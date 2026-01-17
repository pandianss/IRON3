import { Action, SovereignEvent } from '../types';

export enum EventType {
    // Lifecycle
    CONTRACT_CREATED = 'CONTRACT_CREATED',
    SESSION_INTENT = 'SESSION_INTENT',
    SESSION_STARTED = 'SESSION_STARTED',
    SESSION_ENDED = 'SESSION_ENDED',
    INIT_RITUAL = 'INIT_RITUAL',
    INIT_INDUCTION = 'INIT_INDUCTION',

    // Evidence
    EVIDENCE_SUBMITTED = 'EVIDENCE_SUBMITTED',

    // Status
    REST_TAKEN = 'REST_TAKEN',
    PRACTICE_MISSED = 'PRACTICE_MISSED',
    ENTER_RECOVERY = 'ENTER_RECOVERY',
    PRACTICE_COMPLETE = 'PRACTICE_COMPLETE',

    // Admin/Cycle
    CONTINUE_CYCLE = 'CONTINUE_CYCLE',
    MODULE_ACTIVATED = 'MODULE_ACTIVATED',
    MODULE_DEACTIVATED = 'MODULE_DEACTIVATED',
    AUTHORITY_REALIGNED = 'AUTHORITY_REALIGNED',
    SESSION_UPDATE_STATUS = 'SESSION_UPDATE_STATUS',

    // Genesis
    BASELINE_DECLARED = 'BASELINE_DECLARED',
    CAPACITY_DECLARED = 'CAPACITY_DECLARED',
    INJURY_STATUS_DECLARED = 'INJURY_STATUS_DECLARED',
    CADENCE_SELECTED = 'CADENCE_SELECTED',
    GENESIS_VERDICT_SUBMITTED = 'GENESIS_VERDICT_SUBMITTED',
    INSTITUTION_BORN = 'INSTITUTION_BORN',
    INSTITUTION_ACTIVATED = 'INSTITUTION_ACTIVATED',

    // Simulation
    TRAINING_COMPLETED = 'TRAINING_COMPLETED',
    RECOVERY_COMPLETED = 'RECOVERY_COMPLETED',
    INJURY_DECLARED = 'INJURY_DECLARED',
    DISHONEST_LOG = 'DISHONEST_LOG',
    SESSION_MISSED = 'SESSION_MISSED',
    REST_OBSERVED = 'REST_OBSERVED',
    DAILY_EVALUATION = 'DAILY_EVALUATION',

    // Lifecycle Commands
    ACTIVATE_INSTITUTION = 'ACTIVATE_INSTITUTION',
    LIFECYCLE_PROMOTE = 'LIFECYCLE_PROMOTE',
    DAILY_PULSE = 'DAILY_PULSE',
    WEEKLY_CYCLE = 'WEEKLY_CYCLE',

    // Enterprise
    CHARTER_ISSUED = 'CHARTER_ISSUED',
    OBLIGATION_MET = 'OBLIGATION_MET'
}

const RequiredPayloads: Partial<Record<EventType, string[]>> = {
    [EventType.SESSION_INTENT]: ['contractId'],
    [EventType.SESSION_STARTED]: ['venue'],
    [EventType.EVIDENCE_SUBMITTED]: ['venue', 'evidenceType'],
    [EventType.MODULE_ACTIVATED]: ['moduleId'],
    [EventType.MODULE_DEACTIVATED]: ['moduleId'],
    [EventType.DAILY_EVALUATION]: ['day'],
    [EventType.BASELINE_DECLARED]: ['assessment'],
    [EventType.CAPACITY_DECLARED]: ['load'],
    [EventType.CADENCE_SELECTED]: ['cadence'],
    [EventType.GENESIS_VERDICT_SUBMITTED]: ['consent'],
    [EventType.TRAINING_COMPLETED]: ['intensity', 'volume']
};

export class EventRegistry {
    public static create(action: Action): SovereignEvent {
        const type = action.type as EventType;

        if (!Object.values(EventType).includes(type)) {
            throw new Error(`IRON_VIOLATION: Illegal event type '${type}'`);
        }

        const required = RequiredPayloads[type];
        if (required) {
            for (const field of required) {
                if (action.payload[field] === undefined || action.payload[field] === null) {
                    throw new Error(`IRON_VIOLATION: Malformed event '${type}'. Missing '${field}'.`);
                }
            }
        }

        return {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type,
            payload: action.payload,
            actor: action.actor
        };
    }
}
