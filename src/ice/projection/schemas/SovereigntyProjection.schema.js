/**
 * SOVEREIGNTY PROJECTION SCHEMA
 * 
 * Defines the strict whitelist of fields allowed in the public
 * Sovereignty Signal projection.
 * 
 * AUTHORITY: KPL-01
 */

export const SovereigntyProjectionSchema = {
    VERDICTS: ['PENDING', 'PASS', 'FAIL', 'BREACH'],
    ENFORCEMENT_HEALTH: ['NOMINAL', 'DEGRADED', 'OFFLINE'],

    fields: {
        sovereign: 'boolean',
        lastVerdict: 'string',
        obligationsActive: 'boolean',
        enforcementHealth: 'string',
        activeLaws: 'array'
    }
};

export const validateSovereigntyProjection = (data) => {
    const projection = {};

    projection.sovereign = typeof data.sovereign === 'boolean' ? data.sovereign : false;

    if (SovereigntyProjectionSchema.VERDICTS.includes(data.lastVerdict)) {
        projection.lastVerdict = data.lastVerdict;
    } else {
        projection.lastVerdict = 'PENDING';
    }

    projection.obligationsActive = typeof data.obligationsActive === 'boolean' ? data.obligationsActive : false;

    if (SovereigntyProjectionSchema.ENFORCEMENT_HEALTH.includes(data.enforcementHealth)) {
        projection.enforcementHealth = data.enforcementHealth;
    } else {
        projection.enforcementHealth = 'OFFLINE'; // Default to safest failure mode
    }

    projection.activeLaws = Array.isArray(data.activeLaws) ? data.activeLaws : [];

    return projection;
};
