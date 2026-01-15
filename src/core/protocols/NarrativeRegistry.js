/**
 * Narrative Registry
 * Central ledger of all system-generated copy.
 * Must adhere to "Legible Authority" guidelines.
 */

export const NarrativeRegistry = {
    BRIEFING: {
        SLIDE_1: {
            title: "THE BODY IS THE RECORD",
            content: "You are entering a governed state of physical operation. Here, fitness is not a hobby, but a daily mandate. Your standing is determined solely by your consistency."
        },
        SLIDE_2: {
            title: "THE DAILY OBLIGATION",
            content: "Every 24 hours, you must perform the Required Practice. There are no excuses, only the ledger. If you train, you advance. If you rest when lawful, you sustain."
        },
        SLIDE_3: {
            title: "FAILURE IS PERMANENT",
            content: "Missing a required practice is a Fracture. It cannot be undone. It remains on your record forever. Build your Era through unbroken continuity."
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
