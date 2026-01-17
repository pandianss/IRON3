/**
 * THE PROTOCOL REGISTRY
 * 
 * Defines the specialized protocols supported by the IRON platform.
 * Currently initialized to empty state for sovereign genesis.
 */
export const SOVEREIGN_DOMAINS = {
    BIO_REGIME: { id: 'BIO_REGIME', label: 'BIO-REGIME', description: 'Physicality & Health' },
    CAPITAL_COMMAND: { id: 'CAPITAL_COMMAND', label: 'CAPITAL-COMMAND', description: 'Financial Sovereignty' },
    PROFESSIONAL_WARFARE: { id: 'PROFESSIONAL_WARFARE', label: 'PROFESSIONAL-WARFARE', description: 'Career & Output' },
    COGNITIVE_SECURITY: { id: 'COGNITIVE_SECURITY', label: 'COGNITIVE-SECURITY', description: 'Intellect & Focus' },
    SOCIAL_ALLIANCE: { id: 'SOCIAL_ALLIANCE', label: 'SOCIAL-ALLIANCE', description: 'Tribe & Community' },
    SPIRIT_ANCHOR: { id: 'SPIRIT_ANCHOR', label: 'SPIRIT-ANCHOR', description: 'Grounding & Faith' },
    SKILL_ACQUISITION: { id: 'SKILL_ACQUISITION', label: 'SKILL-ACQUISITION', description: 'Growth & Craft' },
    SYSTEM_LOGISTICS: { id: 'SYSTEM_LOGISTICS', label: 'SYSTEM-LOGISTICS', description: 'Environment & Admin' }
};

const BUILT_IN_PROTOCOLS = {
    DISCIPLINE_MORNING_DRILL: {
        id: 'DISCIPLINE_MORNING_DRILL',
        label: 'MORNING DRILL',
        focus: 'Early execution of physical obligations.',
        primaryMetric: 'STREAK',
        domain: 'BIO_REGIME',
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
        domain: 'PROFESSIONAL_WARFARE',
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
        domain: 'SYSTEM_LOGISTICS',
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
        domain: 'BIO_REGIME',
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
        domain: protocol.domain || 'SYSTEM_LOGISTICS', // Default to Logistics if undefined
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
