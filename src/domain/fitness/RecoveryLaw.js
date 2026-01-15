/**
 * RECOVERY LAW
 * 
 * Defines the boundaries of authorized physical activity.
 * Violating Recovery Law results in a STRESS_FRACTURE.
 */
export const RecoveryLaw = {
    /**
     * @param {Object} capacityRecord - From CapacityEngine
     * @param {Object} intent - Current activity intent
     * @param {Object} params - Active constraints (e.g. durationCap)
     */
    evaluateIntent: (capacityRecord, intent, params = {}) => {
        const issues = [];

        // 1. Capacity Floor
        if (capacityRecord.value < 20) {
            issues.push({
                severity: 'CRITICAL',
                type: 'PHYSIOLOGICAL_EXHAUSTION',
                message: 'Internal Capacity below safety threshold. Training forbidden.'
            });
        }

        // 2. Mandatory Rest Windows (Simulation: 11 PM to 5 AM)
        const hour = new Date().getHours();
        if (hour >= 23 || hour <= 5) {
            issues.push({
                severity: 'WARNING',
                type: 'CIRCADIAN_RESTRAINT',
                message: 'System is in Mandatory Rest Window. Activity discouraged.'
            });
        }

        // 3. Deload Duration Cap
        if (intent.type === 'SESSION_ENDED' && params.durationCap && intent.duration > params.durationCap) {
            issues.push({
                severity: 'CRITICAL',
                type: 'DELOAD_VIOLATION',
                message: `Active Recovery Protocol limit: ${params.durationCap} mins. Exceeded by ${intent.duration - params.durationCap} mins.`
            });
        }

        return {
            isAuthorized: issues.every(i => i.severity !== 'CRITICAL'),
            mandates: issues
        };
    }
};

