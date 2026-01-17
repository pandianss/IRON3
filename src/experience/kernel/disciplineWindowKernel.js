import { WINDOW_STATES, WINDOW_CONSTRAINTS, canTransition, VALIDITY_STATUS } from './DisciplineWindow.schema.js';

/**
 * DISCIPLINE WINDOW KERNEL
 * Functional controller for the Discipline Window State Machine.
 */

export function createDisciplineWindow() {
    return Object.freeze({
        id: crypto.randomUUID(),
        state: WINDOW_STATES.IDLE,
        beforeCapturedAt: null,
        afterCapturedAt: null,
        openedAt: null,
        closedAt: null,
        elapsedMs: 0,
        interruptionCount: 0,
        interruptionTimeMs: 0,
        lastInterruptionStart: null,
        history: []
    });
}

export function transition(window, nextState, payload = {}) {
    if (!canTransition(window.state, nextState)) {
        throw new Error(`[UX-KERNEL] Invalid transition from ${window.state} to ${nextState}`);
    }

    const now = Date.now();
    let updatedWindow = { ...window, state: nextState };
    updatedWindow.history = [...window.history, { from: window.state, to: nextState, timestamp: now }];

    switch (nextState) {
        case WINDOW_STATES.PRIMED:
            // Armed but not opened
            break;
        case WINDOW_STATES.OPEN:
            updatedWindow.beforeCapturedAt = now;
            updatedWindow.openedAt = now;
            break;
        case WINDOW_STATES.ACTIVE:
            if (window.state === WINDOW_STATES.INTERRUPTED) {
                const duration = now - window.lastInterruptionStart;
                updatedWindow.interruptionTimeMs += duration;
                updatedWindow.lastInterruptionStart = null;
            }
            break;
        case WINDOW_STATES.INTERRUPTED:
            updatedWindow.interruptionCount += 1;
            updatedWindow.lastInterruptionStart = now;
            break;
        case WINDOW_STATES.CLOSED_VALID:
        case WINDOW_STATES.CLOSED_INVALID:
            updatedWindow.afterCapturedAt = now;
            updatedWindow.closedAt = now;
            updatedWindow.elapsedMs = now - updatedWindow.openedAt - updatedWindow.interruptionTimeMs;
            break;
        case WINDOW_STATES.EXPIRED:
            updatedWindow.closedAt = now;
            updatedWindow.elapsedMs = now - updatedWindow.openedAt - updatedWindow.interruptionTimeMs;
            break;
        case WINDOW_STATES.SEALED:
            return Object.freeze(updatedWindow);
    }

    return updatedWindow;
}

export function computeValidity(window) {
    const reasons = [];
    let status = VALIDITY_STATUS.SUSTAINED;

    const netElapsed = window.elapsedMs;

    if (netElapsed < WINDOW_CONSTRAINTS.MIN_DURATION_MS) {
        status = VALIDITY_STATUS.INSUFFICIENT;
        reasons.push("Duration below institutional minimum (5m).");
    }

    if (window.state === WINDOW_STATES.EXPIRED) {
        status = VALIDITY_STATUS.EXPIRED;
        reasons.push("Window exceeded maximum constitutional duration.");
    }

    if (window.interruptionCount > WINDOW_CONSTRAINTS.MAX_INTERRUPTIONS) {
        status = VALIDITY_STATUS.DEGRADED;
        reasons.push(`Excessive interruptions (${window.interruptionCount}).`);
    }

    if (window.interruptionTimeMs > WINDOW_CONSTRAINTS.MAX_INTERRUPTION_TIME_MS) {
        status = VALIDITY_STATUS.DEGRADED;
        reasons.push("Cumulative interruption time exceeded limits.");
    }

    const isValid = status === VALIDITY_STATUS.SUSTAINED ||
        (status === VALIDITY_STATUS.DEGRADED && window.interruptionCount <= 1);

    return {
        valid: isValid,
        status,
        reasons,
        interruptionCount: window.interruptionCount,
        elapsedMs: netElapsed,
        integrityScore: calculateIntegrityScore(window, status)
    };
}

function calculateIntegrityScore(window, status) {
    let score = 100;
    if (status === VALIDITY_STATUS.DEGRADED) score -= 20 * window.interruptionCount;
    if (status === VALIDITY_STATUS.INSUFFICIENT) score = 0;
    if (status === VALIDITY_STATUS.EXPIRED) score = 10;
    return Math.max(0, score);
}

export const DisciplineWindowKernel = {
    createDisciplineWindow,
    transition,
    computeValidity,
    WINDOW_STATES
};
