/******************************************************************************************
 * SOVEREIGN JOURNEY SCHEMA
 * UX-KERNEL-01 Binding
 * 
 * Defines canonical phases, authorization rules, and experiential tones.
 ******************************************************************************************/

export const EXPERIENCE_PHASES = Object.freeze({
    PRE_INSTITUTIONAL: "pre_institutional",
    INITIATED: "initiated",
    BOUND: "bound",
    ACTIVE: "active",
    DEGRADING: "degrading",
    FAILED: "failed",
    RECOVERING: "recovering",
    SOVEREIGN: "sovereign"
});

export const PHASE_RULES = Object.freeze({
    [EXPERIENCE_PHASES.PRE_INSTITUTIONAL]: {
        allowedSurfaces: ["Boot", "NoInstitution", "Induction", "Diagnostic"],
        ritualRequired: false,
        tone: "neutral",
        authorityCeiling: 0
    },

    [EXPERIENCE_PHASES.INITIATED]: {
        allowedSurfaces: ["Boot", "Orientation", "Standing", "Induction", "Diagnostic", "Threshold"],
        ritualRequired: true,
        tone: "structured",
        authorityCeiling: 1
    },

    [EXPERIENCE_PHASES.BOUND]: {
        allowedSurfaces: ["Standing", "Directive", "Verdict", "Timeline", "EvidenceCapture", "Diagnostic", "Threshold"],
        ritualRequired: true,
        tone: "formal",
        authorityCeiling: 2
    },

    [EXPERIENCE_PHASES.ACTIVE]: {
        allowedSurfaces: ["Standing", "Directive", "Verdict", "Timeline", "Archive", "EvidenceCapture", "Diagnostic", "Threshold"],
        ritualRequired: true,
        tone: "focused",
        authorityCeiling: 3
    },

    [EXPERIENCE_PHASES.DEGRADING]: {
        allowedSurfaces: ["Standing", "Verdict", "Degradation", "Timeline", "Diagnostic", "Threshold"],
        ritualRequired: true,
        tone: "heavy",
        authorityCeiling: 2
    },

    [EXPERIENCE_PHASES.FAILED]: {
        allowedSurfaces: ["Failure", "Verdict", "Recovery", "Diagnostic", "Threshold"],
        ritualRequired: true,
        tone: "severe",
        authorityCeiling: 1
    },

    [EXPERIENCE_PHASES.RECOVERING]: {
        allowedSurfaces: ["Standing", "Verdict", "Recovery", "Timeline", "Diagnostic", "Threshold"],
        ritualRequired: true,
        tone: "procedural",
        authorityCeiling: 2
    },

    [EXPERIENCE_PHASES.SOVEREIGN]: {
        allowedSurfaces: ["Standing", "Directive", "Timeline", "Archive", "Governance", "Diagnostic", "Threshold"],
        ritualRequired: true,
        tone: "calm",
        authorityCeiling: 5
    }
});
