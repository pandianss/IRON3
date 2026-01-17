export interface SovereignDomain {
    id: string;
    label: string;
    description: string;
}

export const SOVEREIGN_DOMAINS: Record<string, SovereignDomain> = {
    BIO_REGIME: { id: 'BIO_REGIME', label: 'BIO-REGIME', description: 'Physicality & Health' },
    CAPITAL_COMMAND: { id: 'CAPITAL_COMMAND', label: 'CAPITAL-COMMAND', description: 'Financial Sovereignty' },
    PROFESSIONAL_WARFARE: { id: 'PROFESSIONAL_WARFARE', label: 'PROFESSIONAL-WARFARE', description: 'Career & Output' },
    COGNITIVE_SECURITY: { id: 'COGNITIVE_SECURITY', label: 'COGNITIVE-SECURITY', description: 'Intellect & Focus' },
    SOCIAL_ALLIANCE: { id: 'SOCIAL_ALLIANCE', label: 'SOCIAL-ALLIANCE', description: 'Tribe & Community' },
    SPIRIT_ANCHOR: { id: 'SPIRIT_ANCHOR', label: 'SPIRIT-ANCHOR', description: 'Grounding & Faith' },
    SKILL_ACQUISITION: { id: 'SKILL_ACQUISITION', label: 'SKILL-ACQUISITION', description: 'Growth & Craft' },
    SYSTEM_LOGISTICS: { id: 'SYSTEM_LOGISTICS', label: 'SYSTEM-LOGISTICS', description: 'Environment & Admin' }
};

export interface Protocol {
    id: string;
    label: string;
    description: string;
    domain: string;
    userCount: number;
    primaryMetric: string;
    ratifiedAt: number;
    isCustom?: boolean;
    focus?: string;
}

// In a full implementation, these would be loaded from a Law Registry or Archive
// For now, we define the authoritative set of "Institutional Defaults"
export const INSTITUTIONAL_DEFAULTS: Record<string, Protocol> = {
    'LAW_MIN_DAILY_FITNESS': {
        id: 'LAW_MIN_DAILY_FITNESS',
        label: 'MINIMUM DAILY FITNESS',
        description: 'Mandatory physical obligation.',
        domain: 'BIO_REGIME',
        userCount: 1,
        primaryMetric: 'COMPLETE',
        ratifiedAt: 1705449600000, // Static date for refactor
        isCustom: false,
        focus: 'Complete before noon. Failure triggers escalation.'
    }
};

export class ProtocolRegistry {
    public static getAll(): Protocol[] {
        return Object.values(INSTITUTIONAL_DEFAULTS);
    }

    public static get(id: string): Protocol | undefined {
        return INSTITUTIONAL_DEFAULTS[id];
    }
}

// Helpers for LegislatureSurface compatibility
export const getProtocolList = () => ProtocolRegistry.getAll();
export const registerProtocol = (protocol: Protocol) => {
    // In strict TypeScript this is read-only, but for runtime hacking:
    (INSTITUTIONAL_DEFAULTS as any)[protocol.id] = protocol;
    return true;
};
