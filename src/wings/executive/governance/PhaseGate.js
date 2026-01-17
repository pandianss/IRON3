/**
 * ICE Module: Phase Gate
 * Role: The Execution Mediator.
 * Responsibilities:
 * - Intercept contract and standing mutations.
 * - Transform or Suppress based on current Phase.
 */
export class PhaseGate {
    /**
     * Mediates a Mutation Request.
     * @param {string} phase - The current institutional phase ID
     * @param {object} request - The requested mutation (e.g. { integrity: -10 })
     * @returns {object|null} The transformed mutation or null if suppressed
     */
    static guardMutation(phase, request) {
        if (phase === 'GENESIS') {
            // Suppression Mode: No negative mutations allowed.
            const entries = Object.entries(request);
            const sanitized = {};
            let hasPositive = false;

            for (const [key, val] of entries) {
                if (typeof val === 'number' && val < 0) {
                    sanitized[key] = 0; // Nullify decay
                } else {
                    sanitized[key] = val;
                    if (val > 0) hasPositive = true;
                }
            }
            return sanitized;
        }

        if (phase === 'PROBATION') {
            // Calibration Mode: Dampened decay, no terminal crossings.
            const damped = {};
            for (const [key, val] of Object.entries(request)) {
                if (typeof val === 'number' && val < 0) {
                    damped[key] = val * 0.5; // 50% decay dampening
                } else {
                    damped[key] = val;
                }
            }
            return damped;
        }

        return request; // Default: Full Execution (ACTIVE/DEGRADED)
    }

    /**
     * Mediates Contract Logic Execution.
     * @param {string} phase 
     * @param {string} mode - 'COMPLIANCE' | 'BREACH'
     */
    static canEscalate(phase, mode) {
        if (phase === 'GENESIS') return false;
        if (phase === 'PROBATION' && mode === 'BREACH') return false;
        return true;
    }
}
