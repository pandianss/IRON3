/**
 * Governed Action: ACTIVATE_INSTITUTION
 * Defines the constitutional meaning of institutional birth.
 */
export const ACTIVATE_INSTITUTION = {
    name: "ACTIVATE_INSTITUTION",
    description: "Initialize and activate a new institutional entity.",
    requiredContext: ["payload.health", "payload.foundation.why"],
    rules: ["P-ACT-01", "P-ACT-02"],
    violationClasses: {
        HEALTH_TOO_LOW: "CRITICAL",
        MISSING_FOUNDATION: "SUPREME"
    }
};
