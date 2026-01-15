/**
 * THE INSTITUTIONAL REGISTRY
 * 
 * Defines the specialized domains supported by the IRON platform.
 * Each template dictates specific Standing rules, Breach conditions, and Mandates.
 */
export const DisciplineRegistry = {
    PERSONAL_DISCIPLINE: {
        id: 'PERSONAL_DISCIPLINE',
        label: 'Core Discipline',
        focus: 'Individual willpower and habit lock-in.',
        primaryMetric: 'Consistency'
    },
    FITNESS_RECOVERY: {
        id: 'FITNESS_RECOVERY',
        label: 'Fitness & Recovery',
        focus: 'Physical performance and biological rest cycles.',
        primaryMetric: 'Capacity'
    },
    FOUNDER_OPERATING: {
        id: 'FOUNDER_OPERATING',
        label: 'Founder Performance',
        focus: 'Strategic output and decision quality.',
        primaryMetric: 'Velocity'
    },
    LEARNING_MASTERY: {
        id: 'LEARNING_MASTERY',
        label: 'Skill Mastery',
        focus: 'Cognitive depth and knowledge retention.',
        primaryMetric: 'Legibility'
    },
    CREATIVE_OUTPUT: {
        id: 'CREATIVE_OUTPUT',
        label: 'Creative Volume',
        focus: 'Generator cycles and creative output volume.',
        primaryMetric: 'Volume'
    },
    TEAM_ACCOUNTABILITY: {
        id: 'TEAM_ACCOUNTABILITY',
        label: 'Group Accountability',
        focus: 'Shared obligations and team momentum.',
        primaryMetric: 'Trust'
    },
    STUDENT_PERFORMANCE: {
        id: 'STUDENT_PERFORMANCE',
        label: 'Academic Performance',
        focus: 'Resource discipline and intellectual growth.',
        primaryMetric: 'Proficiency'
    },
    REHABILITATION: {
        id: 'REHABILITATION',
        label: 'Recovery Protocol',
        focus: 'Behavioral re-alignment and restraint.',
        primaryMetric: 'Integrity'
    },
    FINANCIAL_CONDUCT: {
        id: 'FINANCIAL_CONDUCT',
        label: 'Financial Discipline',
        focus: 'Resource management and fiscal law.',
        primaryMetric: 'Preservation'
    }
};

export const getDisciplineList = () => Object.values(DisciplineRegistry);

