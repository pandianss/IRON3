/**
 * JUDICIAL WING: VERDICT MACHINE
 * Role: Arbitrate the validity of sovereign acts and sessions.
 * Decoupled from UX for jurisdictional purity.
 */

import { VALIDITY_STATUS, WINDOW_CONSTRAINTS } from '../../experiential/kernel/SovereignWindow.schema.js';

/**
 * Computes the validity of a Sovereign Window session.
 */
export function computeSessionVerdict(window) {
    const reasons = [];
    let status = VALIDITY_STATUS.SUSTAINED;

    const netElapsed = window.elapsedMs;

    // 1. Duration Arbitration
    if (netElapsed < WINDOW_CONSTRAINTS.MIN_DURATION_MS) {
        status = VALIDITY_STATUS.INSUFFICIENT;
        reasons.push("Temporal depth insufficient for sovereign recognition (min 5m).");
    }

    if (window.state === "expired") {
        status = VALIDITY_STATUS.EXPIRED;
        reasons.push("Session exceeded constitutional temporal bounds.");
    }

    // 2. Continuity Arbitration
    if (window.interruptionCount > WINDOW_CONSTRAINTS.MAX_INTERRUPTIONS) {
        status = VALIDITY_STATUS.DEGRADED;
        reasons.push(`Continuity fractured beyond acceptable threshold (${window.interruptionCount} breaks).`);
    }

    if (window.interruptionTimeMs > WINDOW_CONSTRAINTS.MAX_INTERRUPTION_TIME_MS) {
        status = VALIDITY_STATUS.DEGRADED;
        reasons.push("Cumulative temporal loss during interruptions exceeded grace period.");
    }

    const isValid = status === VALIDITY_STATUS.SUSTAINED ||
        (status === VALIDITY_STATUS.DEGRADED && window.interruptionCount <= 1);

    return {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        valid: isValid,
        status,
        reasons,
        metrics: {
            interruptionCount: window.interruptionCount,
            elapsedMs: netElapsed,
            integrityScore: calculateIntegrityScore(window, status)
        }
    };
}

/**
 * Pure function to calculate integrity based on judicial precedent.
 */
function calculateIntegrityScore(window, status) {
    let score = 100;
    if (status === VALIDITY_STATUS.DEGRADED) score -= 20 * window.interruptionCount;
    if (status === VALIDITY_STATUS.INSUFFICIENT) score = 0;
    if (status === VALIDITY_STATUS.EXPIRED) score = 10;
    return Math.max(0, score);
}

export const VerdictMachine = {
    computeSessionVerdict
};
