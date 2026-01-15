/**
 * RECOVERY LAW
 * 
 * Defines the boundaries of authorized physical activity.
 * Violating Recovery Law results in a STRESS_FRACTURE.
 */
export const RecoveryLaw = {
    /**
     * @param {Object} capacityRecord - From CapacityEngine
     * @param {number} currentTime - Current timestamp
     */
    evaluateIntent: (capacityRecord, intent) => {
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

        return {
            isAuthorized: issues.every(i => i.severity !== 'CRITICAL'),
            mandates: issues
        };
    }
};
