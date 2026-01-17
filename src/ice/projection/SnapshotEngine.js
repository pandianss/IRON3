/**
 * KERNEL SNAPSHOT ENGINE
 * 
 * The "Camera" of the Institution.
 * Responsible for generating immutable, hashed point-in-time representations
 * of the entire Institutional State.
 * 
 * AUTHORITY: KPL-01
 */

// Simple hash util (replace with crypto if needed, sufficient for tamper-resistance)
const generateHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
};

export const SnapshotEngine = {

    /**
     * Generate a Sealed Snapshot from raw Kernel State.
     * @param {Object} rawState - The internal state of the kernel engines.
     * @returns {Object} Sealed KernelSnapshot.
     */
    sealSnapshot: (rawState) => {
        // 1. Construct the Snapshot Object
        const snapshot = {
            meta: {
                timestamp: Date.now(),
                kernelVersion: '3.0.0-SOVEREIGN',
                generatedAt: new Date().toISOString()
            },
            institution: {
                lifecycleState: rawState.lifecycle?.state || 'GENESIS',
                standingClass: rawState.standing?.class || 'NONE',
                integrityStatus: rawState.integrity?.status || 'INTACT',
                institutionAgeDays: rawState.lifecycle?.age || 0,
                currentStreak: rawState.standing?.streak || 0,
                activeDiscipline: rawState.standing?.focus || null
            },
            sovereignty: {
                sovereign: rawState.compliance?.isSovereign || false,
                lastVerdict: rawState.verdict?.last || 'PENDING',
                obligationsActive: rawState.compliance?.obligationsMet || false,
                enforcementHealth: rawState.system?.health || 'NOMINAL',
                activeLaws: rawState.compliance?.activeModules || []
            }
        };

        // 2. Hash it to seal validity
        const contentString = JSON.stringify(snapshot.institution) + JSON.stringify(snapshot.sovereignty);
        snapshot.meta.hash = generateHash(contentString);

        // 3. Deep Freeze to prevent mutation
        return deepFreeze(snapshot);
    }
};

const deepFreeze = (object) => {
    const propNames = Object.getOwnPropertyNames(object);
    for (const name of propNames) {
        const value = object[name];
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
};
