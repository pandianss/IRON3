/**
 * THE INSTITUTIONAL REGISTRY
 * 
 * Defines the specialized domains supported by the IRON platform.
 * Each template dictates specific Standing rules, Breach conditions, and Mandates.
 */
export const InstitutionalTemplates = {
    PERSONAL_DISCIPLINE: {
        id: 'PERSONAL_DISCIPLINE',
        label: 'Personal Discipline Institution',
        focus: 'Individual willpower, habit lock-in, and core sovereignty.',
        primaryMetric: 'Consistency'
    },
    FITNESS_RECOVERY: {
        id: 'FITNESS_RECOVERY',
        label: 'Fitness & Recovery Institution',
        focus: 'Physical performance, biological rest cycles, and progressive loading.',
        primaryMetric: 'Capacity'
    },
    FOUNDER_OPERATING: {
        id: 'FOUNDER_OPERATING',
        label: 'Founder Operating Institution',
        focus: 'Strategic output, decision quality, and venture momentum.',
        primaryMetric: 'Velocity'
    },
    LEARNING_MASTERY: {
        id: 'LEARNING_MASTERY',
        label: 'Learning & Mastery Institution',
        focus: 'Skill acquisition, cognitive depth, and knowledge retention.',
        primaryMetric: 'Legibility'
    },
    CREATIVE_OUTPUT: {
        id: 'CREATIVE_OUTPUT',
        label: 'Creative Output Institution',
        focus: 'Generator cycles, creative volume, and finished works.',
        primaryMetric: 'Volume'
    },
    TEAM_ACCOUNTABILITY: {
        id: 'TEAM_ACCOUNTABILITY',
        label: 'Team Accountability Institution',
        focus: 'Collaborative sovereignty, shared obligations, and group momentum.',
        primaryMetric: 'Trust'
    },
    STUDENT_PERFORMANCE: {
        id: 'STUDENT_PERFORMANCE',
        label: 'Student Performance Institution',
        focus: 'Academic rigor, assessment readiness, and intellectual growth.',
        primaryMetric: 'Proficiency'
    },
    REHABILITATION: {
        id: 'REHABILITATION',
        label: 'Rehabilitation Institution',
        focus: 'Recovery protocols, restraint, and behavioral re-alignment.',
        primaryMetric: 'Integrity'
    },
    FINANCIAL_CONDUCT: {
        id: 'FINANCIAL_CONDUCT',
        label: 'Financial Conduct Institution',
        focus: 'Resource discipline, capital preservation, and fiscal law.',
        primaryMetric: 'Preservation'
    }
};

export const getTemplateList = () => Object.values(InstitutionalTemplates);
