/**
 * FITNESS CAPACITY ENGINE
 * 
 * Calculates Institutional Capacity based on training load vs. recovery.
 * 
 * Capacity (0-100)
 * 100 = Fully Primed
 * < 30 = Mandated Rest
 */
export const CapacityEngine = {
    /**
     * @param {Array} events - Physiological and Training events
     * @param {Object} currentStanding - Current institutional standing
     */
    calculate: (events, currentStanding) => {
        let load = 0;
        let recovery = 50; // Base recovery level

        // Process events in chronological order
        events.forEach(event => {
            switch (event.type) {
                case 'SESSION_ENDED':
                    // Work adds load
                    load += (event.payload?.duration || 30) / 10;
                    break;
                case 'RECOVERY_VALIDATED':
                    // Recovery (Sleep/Rest) reduces load and adds capacity
                    load = Math.max(0, load - (event.payload?.quality || 5));
                    recovery = Math.min(100, recovery + (event.payload?.points || 10));
                    break;
                case 'HEART_RATE_VARIABILITY':
                    // HRV acts as a multiplier for recovery efficiency
                    const hrvFactor = (event.payload?.value || 50) / 50;
                    recovery = Math.min(100, recovery * hrvFactor);
                    break;
            }
        });

        // Decay load over time (Time heals)
        // In a real system, we'd use timestamps. For this simulation, we'll assume a decay per cycle.
        const currentCapacity = Math.max(0, Math.min(100, recovery - load));

        return {
            value: Math.round(currentCapacity),
            load: Math.round(load),
            recovery: Math.round(recovery),
            status: currentCapacity < 30 ? 'CRITICAL_DEBT' : (currentCapacity < 60 ? 'STRAINED' : 'OPTIMAL')
        };
    }
};
