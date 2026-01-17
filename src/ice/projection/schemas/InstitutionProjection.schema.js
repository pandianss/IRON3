/**
 * INSTITUTION PROJECTION SCHEMA
 * 
 * Defines the strict whitelist of fields allowed in the public 
 * Institutional State projection.
 * 
 * AUTHORITY: KPL-01
 */

export const InstitutionProjectionSchema = {
    // Enum Constraints
    LIFECYCLE_STATES: ['GENESIS', 'PROBATION', 'ACTIVE', 'DEGRADED', 'SUSPENDED'],
    STANDING_CLASSES: ['NONE', 'FOUNDATION', 'SOVEREIGN', 'ELITE'],
    INTEGRITY_STATES: ['INTACT', 'FRACTURED', 'BREACHED'],

    // The Shape of the Projection
    fields: {
        lifecycleState: 'string', // Must match LIFECYCLE_STATES
        standingClass: 'string',  // Must match STANDING_CLASSES
        integrityStatus: 'string', // Must match INTEGRITY_STATES
        institutionAgeDays: 'number',
        currentStreak: 'number',
        activeDiscipline: 'string' // Nullable
    }
};

/**
 * Validates a raw object against the schema.
 * Strips unknown fields.
 */
export const validateInstitutionProjection = (data) => {
    const projection = {};

    // Whitelist Mapping
    if (InstitutionProjectionSchema.LIFECYCLE_STATES.includes(data.lifecycleState)) {
        projection.lifecycleState = data.lifecycleState;
    } else {
        projection.lifecycleState = 'GENESIS'; // Default Safe State
    }

    if (InstitutionProjectionSchema.STANDING_CLASSES.includes(data.standingClass)) {
        projection.standingClass = data.standingClass;
    } else {
        projection.standingClass = 'NONE';
    }

    if (InstitutionProjectionSchema.INTEGRITY_STATES.includes(data.integrityStatus)) {
        projection.integrityStatus = data.integrityStatus;
    } else {
        projection.integrityStatus = 'INTACT';
    }

    projection.institutionAgeDays = typeof data.institutionAgeDays === 'number' ? data.institutionAgeDays : 0;
    projection.currentStreak = typeof data.currentStreak === 'number' ? data.currentStreak : 0;
    projection.activeDiscipline = typeof data.activeDiscipline === 'string' ? data.activeDiscipline : null;

    return projection;
};
