/**
 * Narrative Registry
 * Central ledger of all system-generated copy.
 * Must adhere to "Legible Authority" guidelines.
 */

export const NarrativeRegistry = {
    BRIEFING: {
        SLIDE_1: {
            title: "GOVERNED SPACE",
            content: "IRON is not a productivity tool. It is a behavioral institution. By entering, you submit your daily practice to external adjudication."
        },
        SLIDE_2: {
            title: "THE RECORD",
            content: "Every action—or inaction—becomes part of a permanent behavioral record. This record cannot be edited, only appended to."
        },
        SLIDE_3: {
            title: "RIGHTS & OBLIGATIONS",
            content: "You have the right to explanation. You have the obligation of consistency. The system has the authority to declare fracture."
        }
    },
    ADJUDICATION: {
        HEADER: "DID YOU BEGIN?",
        BTN_CONFIRM: "YES, I PRACTICED",
        BTN_REST: "AUTHORIZED REST",
        BTN_FAIL: "I DID NOT",
        FOOTER: "DAILY ADJUDICATION • FORM 202"
    },
    FRACTURE: {
        TITLE: "FRACTURE",
        EVENT_ID_PREFIX: "EVENT ID: #FR-",
        ORDER: "Practice continuity has fractured.\n\nOver the last period, scheduled practices were not recorded. This pattern meets the institution's definition of a fracture event.\n\nProgress has been frozen to prevent silent decay. Normal governance is suspended.",
        PATH: "A recovery protocol is now available. Reduced obligations will be used to re-establish continuity."
    },
    STATUS: {
        INDUCTION: "You are entering a protected phase. The system will observe before enforcing.",
        CORE: "Standard governance. Consistency is required.",
        AT_RISK: "Risk has increased. Protective measures are active.",
        RECOVERING: "You are in recovery. Expectations are reduced."
    }
};
