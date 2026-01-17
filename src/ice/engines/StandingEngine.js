import { transition } from '../../institution/logic/standing-engine/standingTransitions.js';
import { PhaseGate } from '../governance/PhaseGate.js';

const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.toDateString() === date2.toDateString();
};

/**
 * ICE Module 6: Standing Engine
 * Role: The Constitutional Interpreter.
 * Responsibilities:
 * - Evaluate institutional condition based on Ledger.
 * - Compute Integrity Score.
 * - Produce Symbolic Standing.
 */
export class StandingEngine {
    constructor(kernel) {
        this.kernel = kernel;
        this.currentState = {
            state: 'PRE_INDUCTION',
            integrity: 100, // Entropy inverted? Or Integrity raw?
            entropy: 0,
            streak: 0,
            lastPracticeDate: null,
            rituals: {
                todayCompleted: false,
                lastRitualAt: null
            }
        };
    }

    /**
     * Replays the entire history to derive current standing.
     * (Optimized: In reality, we snapshot, but for MVP we replay or use last snapshot + new events).
     */
    computeStanding() {
        const history = this.kernel.ledger.getHistory();

        let state = {
            state: 'PRE_INDUCTION',
            entropy: 0,
            streak: 0,
            lastPracticeDate: null,
            rituals: {
                todayCompleted: false,
                lastRitualAt: null
            }
        };

        // Replay
        const phase = this.kernel.state.getDomain('phase')?.id || 'GENESIS';

        for (const event of history) {
            const next = transition(state, event.type);
            if (next) {
                // Apply Phase Gate to potential standing changes
                const guarded = PhaseGate.guardMutation(phase, next);
                state = { ...state, ...guarded };
            }

            // Track ritual completion
            if (event.type === 'SESSION_ENDED' || event.type === 'PRACTICE_COMPLETE' || event.type === 'TRAINING_COMPLETED') {
                if (isSameDay(event.meta?.timestamp || event.timestamp, new Date())) {
                    state.rituals.todayCompleted = true;
                    state.rituals.lastRitualAt = event.meta?.timestamp || event.timestamp;
                }
            }
        }

        // Update Internal Engine State
        this.currentState = state;

        // Update Institution State (Read Model)
        this.kernel.setState('rituals', state.rituals);
        this.kernel.setState('standing', {
            state: state.state,
            integrity: 100 - state.entropy,
            streak: state.streak,
            lastUpdated: new Date().toISOString(),
            lastPracticeDate: state.lastPracticeDate
        });

        console.log(`ICE: Standing Computed -> ${state.state} (Streak: ${state.streak})`);
    }

    getCurrentStanding() {
        return { ...this.currentState };
    }
}
