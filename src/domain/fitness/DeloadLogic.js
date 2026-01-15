/**
 * FITNESS DELOAD LOGIC
 * 
 * Rules for transitioning into and out of "Active Recovery" (Deload).
 */
export const DeloadLogic = {
    /**
     * @param {Object} currentPhysiology - Snapshot of physiology state
     * @returns {string|null} Recommended Era transition
     */
    evaluateTransition: (currentPhysiology) => {
        const { capacity, status, era = 'PEAK' } = currentPhysiology;

        // 1. Auto-Recommendation: Continuous Critical Debt
        if (status === 'CRITICAL_DEBT' && era === 'PEAK') {
            return 'DELOAD';
        }

        // 2. Recovery Exit: High capacity achieved in Deload
        if (capacity > 90 && era === 'DELOAD') {
            return 'PEAK';
        }

        return null;
    },

    /**
     * How Deload affects engine parameters
     */
    getParameters: (era) => {
        if (era === 'DELOAD') {
            return {
                loadMultiplier: 0.5,        // Work adds 50% less stress
                recoveryMultiplier: 1.5,    // Sleep/Rest adds 50% more recovery
                durationCap: 45             // Mandatory session cap in minutes
            };
        }
        return {
            loadMultiplier: 1.0,
            recoveryMultiplier: 1.0,
            durationCap: null
        };
    }
};
