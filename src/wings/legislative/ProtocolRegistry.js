import { LawArchive } from './LawArchive';

/**
 * THE PROTOCOL REGISTRY
 * 
 * Defines the specialized protocols supported by the IRON platform.
 * Aggregates Built-In Laws (Hardcoded) and Private Laws (Archive).
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

/**
 * Get the full list of available protocols.
 * Merges Constitution (Built-in) + Archive (Private).
 */
export const getProtocolList = () => {
    const privateLaws = LawArchive.loadLaws();
    return [...Object.values(BUILT_IN_PROTOCOLS), ...Object.values(privateLaws)];
};

/**
 * Get a specific protocol by ID.
 */
export const getProtocol = (id) => {
    // Check Built-in first
    if (BUILT_IN_PROTOCOLS[id]) return BUILT_IN_PROTOCOLS[id];

    // Then check Archive
    const privateLaws = LawArchive.loadLaws();
    return privateLaws[id];
};

/**
 * Register a new protocol into the Archive.
 */
export const registerProtocol = (protocol) => {
    return LawArchive.saveLaw(protocol);
};
