import { WINDOW_STATES, WINDOW_CONSTRAINTS, canTransition, VALIDITY_STATUS } from './SovereignWindow.schema.js';

/**
 * SOVEREIGN WINDOW KERNEL
 * Functional controller for the Sovereign Window State Machine.
 */

export function createSovereignWindow() {
    return Object.freeze({
        id: crypto.randomUUID(),
        state: WINDOW_STATES.IDLE,
        initialEvidenceAt: null,
        terminalEvidenceAt: null,
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
        throw new Error(`[SOVEREIGN-UX-KERNEL] Invalid transition from ${window.state} to ${nextState}`);
    }

    const now = Date.now();
    let updatedWindow = { ...window, state: nextState };
    updatedWindow.history = [...window.history, { from: window.state, to: nextState, timestamp: now }];

    switch (nextState) {
        case WINDOW_STATES.PRIMED:
            // Armed but not opened
            break;
        case WINDOW_STATES.OPEN:
            updatedWindow.initialEvidenceAt = now;
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
            updatedWindow.terminalEvidenceAt = now;
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

import { VerdictMachine } from '../../judicial/verdicts/VerdictMachine.js';

export function computeValidity(window) {
    const verdict = VerdictMachine.computeSessionVerdict(window);
    return {
        ...verdict,
        ...verdict.metrics // Maintain backward compatibility if needed, but the structure is cleaner now
    };
}

export const SovereignWindowKernel = {
    createSovereignWindow,
    transition,
    computeValidity,
    WINDOW_STATES
};
