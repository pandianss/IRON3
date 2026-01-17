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
        primaryMetric: 'Consistency',
        law: {
            title: 'IRON — Personal Discipline v1',
            preamble: 'To establish a sovereign command over one\'s own actions through order and accountability.',
            articles: [
                { title: 'The Daily Start', content: 'Each day begins with the activation of the sovereign intent.' },
                { title: 'The Non-Negotiable', content: 'One task, however small, shall be performed without exception.' }
            ]
        }
    },
    FITNESS_RECOVERY: {
        id: 'FITNESS_RECOVERY',
        label: 'Fitness & Recovery',
        focus: 'Physical performance and biological rest cycles.',
        primaryMetric: 'Capacity',
        law: {
            title: 'IRON — Fitness Constitution v1',
            preamble: 'To protect physical integrity and institutionalize recovery discipline.',
            articles: [
                { title: 'Continuity', content: 'Long-term participation outweighs short-term extremes.' },
                { title: 'Recovery as Law', content: 'Rest is a governed behavior, not a suggestion.' }
            ]
        }
    },
    FOUNDER_OPERATING: {
        id: 'FOUNDER_OPERATING',
        label: 'Founder Performance',
        focus: 'Strategic output and decision quality.',
        primaryMetric: 'Velocity',
        law: {
            title: 'Sovereign Founder Operating Law',
            preamble: 'Optimizing for strategic clarity and high-velocity execution.',
            articles: [
                { title: 'Decision Integrity', content: 'Decisions must be logged with evidence of reasoning.' },
                { title: 'Deep Work Gates', content: 'Access to shallow distraction is restricted during focus blocks.' }
            ]
        }
    },
    LEARNING_MASTERY: {
        id: 'LEARNING_MASTERY',
        label: 'Skill Mastery',
        focus: 'Cognitive depth and knowledge retention.',
        primaryMetric: 'Legibility',
        law: {
            title: 'Cognitive Sovereignty Charter',
            preamble: 'Transforming information into legible, retained knowledge.',
            articles: [
                { title: 'Recall Duty', content: 'Daily retrieval practice is mandatory for maintained mastery.' },
                { title: 'Encoding Priority', content: 'Depth of understanding over breadth of exposure.' }
            ]
        }
    },
    CREATIVE_OUTPUT: {
        id: 'CREATIVE_OUTPUT',
        label: 'Creative Volume',
        focus: 'Generator cycles and creative output volume.',
        primaryMetric: 'Volume',
        law: {
            title: 'Creative Production Protocol',
            preamble: 'Maintaining a consistent and prolific creative output cycle.',
            articles: [
                { title: 'The Daily Draft', content: 'Production is prioritized over polish during the active cycle.' },
                { title: 'Output Floor', content: 'A minimum volume of output is required for institutional health.' }
            ]
        }
    },
    TEAM_ACCOUNTABILITY: {
        id: 'TEAM_ACCOUNTABILITY',
        label: 'Group Accountability',
        focus: 'Shared obligations and team momentum.',
        primaryMetric: 'Trust',
        law: {
            title: 'Shared Sovereignty Accord',
            preamble: 'Establishing mutual accountability through transparent performance.',
            articles: [
                { title: 'Public Ledger', content: 'All commitments are visible to the collective for verification.' },
                { title: 'The Vouching Bond', content: 'Peers must attest to the validity of submitted evidence.' }
            ]
        }
    },
    STUDENT_PERFORMANCE: {
        id: 'STUDENT_PERFORMANCE',
        label: 'Academic Performance',
        focus: 'Resource discipline and intellectual growth.',
        primaryMetric: 'Proficiency',
        law: {
            title: 'Academic Discipline Law',
            preamble: 'Governing the pursuit of academic proficiency and intellectual growth.',
            articles: [
                { title: 'Study Blocks', content: 'Daily focus periods dedicated to core curriculum.' },
                { title: 'Proof of Mastery', content: 'Self-testing is required before material can be marked as complete.' }
            ]
        }
    },
    REHABILITATION: {
        id: 'REHABILITATION',
        label: 'Recovery Protocol',
        focus: 'Behavioral re-alignment and restraint.',
        primaryMetric: 'Integrity',
        law: {
            title: 'Behavioral Rehabilitation Law',
            preamble: 'Correcting breach patterns through structured restraint and re-alignment.',
            articles: [
                { title: 'Restraint Gates', content: 'Access to prohibited triggers is locked via technical barriers.' },
                { title: 'Accountability Sourcing', content: 'Multiple sources of truth are used to verify compliance.' }
            ]
        }
    },
    FINANCIAL_CONDUCT: {
        id: 'FINANCIAL_CONDUCT',
        label: 'Financial Discipline',
        focus: 'Resource management and fiscal law.',
        primaryMetric: 'Preservation',
        law: {
            title: 'Fiscal Sovereignty Charter',
            preamble: 'Managing financial resources through strict institutional law.',
            articles: [
                { title: 'The Spending Gate', content: 'All expenditures over the threshold require a 24-hour cool-down.' },
                { title: 'Reserve Integrity', content: 'Savings targets are institutional obligations, not suggestions.' }
            ]
        }
    }
};

export const getDisciplineList = () => Object.values(DisciplineRegistry);

