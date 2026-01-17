/**
 * THE PROTOCOL REGISTRY
 * 
 * Defines the specialized protocols supported by the IRON platform.
 * Currently initialized to empty state for sovereign genesis.
 */
const BUILT_IN_PROTOCOLS = {
    DISCIPLINE_MORNING_DRILL: {
        id: 'DISCIPLINE_MORNING_DRILL',
        label: 'MORNING DRILL',
        focus: 'Early execution of physical obligations.',
        primaryMetric: 'STREAK',
        category: 'OFFICIAL',
        userCount: 12405,
        requirements: [
            { type: 'TIME', value: '06:00' },
            { type: 'INPUT', value: 'Hydration Log' }
        ]
    },
    DISCIPLINE_DEEP_WORK: {
        id: 'DISCIPLINE_DEEP_WORK',
        label: 'DEEP WORK',
        focus: 'Sovereign ownership of attention.',
        primaryMetric: 'HOURS',
        category: 'POPULAR',
        userCount: 8932,
        requirements: [
            { type: 'BLOCKER', value: 'Social Media' },
            { type: 'TIMER', value: '90m' }
        ]
    },
    DISCIPLINE_EVENING_AUDIT: {
        id: 'DISCIPLINE_EVENING_AUDIT',
        label: 'EVENING AUDIT',
        focus: 'Reconciliation of daily debt.',
        primaryMetric: 'COMPLETION',
        category: 'OFFICIAL',
        userCount: 5600,
        requirements: [
            { type: 'INPUT', value: 'Journal' }
        ]
    },
    DISCIPLINE_FASTING: {
        id: 'DISCIPLINE_FASTING',
        label: 'IRON FAST',
        focus: 'Metabolic sovereignty.',
        primaryMetric: 'HOURS',
        category: 'POPULAR',
        userCount: 3210,
        requirements: [
            { type: 'TIMER', value: '16h' }
        ]
    }
};

// Internal State for Registry
let privateProtocols = {};

// Initialize Registry from Memory
const loadPrivateLaws = () => {
    try {
        const saved = localStorage.getItem('IRON_PRIVATE_LAWS');
        if (saved) {
            privateProtocols = JSON.parse(saved);
        }
    } catch (e) {
        console.error("REGISTRY: Failed to load private laws.", e);
    }
};

// Load on module init
loadPrivateLaws();

export const ProtocolRegistry = {
    ...BUILT_IN_PROTOCOLS,
    ...privateProtocols
};

export const getProtocolList = () => {
    // Refresh private protocols in case of updates
    return [...Object.values(BUILT_IN_PROTOCOLS), ...Object.values(privateProtocols)];
};

export const getProtocol = (id) => {
    return BUILT_IN_PROTOCOLS[id] || privateProtocols[id];
};

export const registerProtocol = (protocol) => {
    if (!protocol || !protocol.id) {
        throw new Error("INVALID_PROTOCOL: Missing ID");
    }

    // Save to memory
    privateProtocols[protocol.id] = {
        ...protocol,
        category: 'PRIVATE', // Force private category for user imports
        userCount: 1, // Only you
        isCustom: true
    };

    // Upate persistence
    try {
        localStorage.setItem('IRON_PRIVATE_LAWS', JSON.stringify(privateProtocols));
    } catch (e) {
        console.error("REGISTRY: Failed to persist law.", e);
    }

    // Note: The exported 'ProtocolRegistry' object itself is static-ish in ESM imports, 
    // so consumers should rely on getProtocol() or getProtocolList() for dynamic data.
    return true;
};
