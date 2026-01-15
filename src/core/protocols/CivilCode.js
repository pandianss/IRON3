/**
 * Civil Code
 * Defines the Governance States and Laws of the Institution.
 */

export const CivilState = {
    INDUCTION: 'INDUCTION',         // Phase 2: First 30 days (Protected)
    CORE_GOVERNANCE: 'CORE_GOVERNANCE', // Phase 3: Daily Adjudication
    AT_RISK: 'AT_RISK',             // Phase 4: Pre-Collapse Warning
    FRACTURED: 'FRACTURED',         // Phase 4: Collapse Event (Frozen)
    RECOVERING: 'RECOVERING'        // Phase 4: Structured Rebuild
};

export const CivilCode = {
    activeVersion: 'IRON_V1',

    // The Laws governing each state
    LAWS: {
        [CivilState.INDUCTION]: {
            obligations: ['DAILY_BRIEFING', 'DAILY_PRACTICE'],
            rights: ['IMMUNITY_FROM_FRACTURE', 'NARRATIVE_GUIDANCE'],
            description: "You are entering a protected phase. The system will observe before enforcing."
        },
        [CivilState.CORE_GOVERNANCE]: {
            obligations: ['DAILY_PRACTICE', 'STATE_CHECK'],
            rights: ['ACCUMULATION_OF_HISTORY', 'APPEAL'],
            description: "Standard governance. Consistency is required."
        },
        [CivilState.AT_RISK]: {
            obligations: ['IMMEDIATE_CORRECTION'],
            rights: ['WARNING_NOTICE'],
            description: "Risk has increased. Protective measures are active."
        },
        [CivilState.FRACTURED]: {
            obligations: ['ACKNOWLEDGE_FRACTURE', 'ENTER_RECOVERY'],
            rights: [], // Rights are suspended
            description: "Practice continuity has fractured. Progress is frozen."
        },
        [CivilState.RECOVERING]: {
            obligations: ['REDUCED_PRACTICE', 'INTENTION_SETTING'],
            rights: ['GRADUAL_RESTORATION'],
            description: "You are in recovery. Expectations are reduced."
        }
    },

    // Validation Logic for Lawful Acts
    adjudicate: (state, actionType) => {
        // Example: logic to determine if an action is valid in a given state
        if (state === CivilState.FRACTURED && actionType !== 'ENTER_RECOVERY') {
            return { lawful: false, reason: "Must enter recovery to proceed." };
        }
        return { lawful: true };
    }
};
