/**
 * CONSTRAINT VERIFIER KERNEL
 * 
 * The runtime engine that adjudicates whether a specific Protocol Law
 * has been satisfied by the provided Context.
 * 
 * Invoked by the Sovereign Kernel before issuing a Verdict.
 */

export const ConstraintVerifier = {

    /**
     * Verify a full Protocol against a Context.
     * @param {Object} protocol - The JSON Protocol Definition.
     * @param {Object} context - The Runtime Context (Date, Inputs, GPS, etc.)
     * @returns {Object} { passed: boolean, failures: [] }
     */
    verify: (protocol, context) => {
        if (!protocol || !protocol.requirements) {
            return { passed: true, failures: [] }; // No requirements = Always Pass
        }

        const failures = [];

        protocol.requirements.forEach(req => {
            const result = verifyConstraint(req, context);
            if (!result.passed) {
                failures.push(result.reason);
            }
        });

        return {
            passed: failures.length === 0,
            failures: failures
        };
    }
};

/**
 * Internal Router for Verification Logic
 */
const verifyConstraint = (req, context) => {
    switch (req.type) {

        case 'TIME':
            // Verify Time (e.g., "Must be before 06:00")
            // This is a simplified check. Real check needs proper Date parsing.
            return performTimeCheck(req.value, context.timestamp);

        case 'INPUT':
            // Verify Data Input (e.g., "Must contain text")
            if (!context.inputData || context.inputData.length < 5) {
                return { passed: false, reason: `Insufficient Input: ${req.value}` };
            }
            return { passed: true };

        case 'GPS':
            // Verify Location (Stubbed for now)
            if (!context.gps) {
                return { passed: false, reason: "GPS Signal Required" };
            }
            return { passed: true };

        case 'PHOTO':
            // Verify Photo Evidence
            if (!context.photo) {
                return { passed: false, reason: "Visual Evidence Required" };
            }
            return { passed: true };

        default:
            return { passed: true }; // Unknown constraints are non-blocking for now
    }
};

const performTimeCheck = (targetTime, contextTime) => {
    if (!contextTime) return { passed: true }; // Cannot verify without clock

    // Stub implementation: Just checks existence for now
    // Real implementation would parse HH:MM and compare.
    return { passed: true };
};
