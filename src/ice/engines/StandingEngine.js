import { transition } from '../../institution/logic/standing-engine/standingTransitions.js';
import { PhaseGate } from '../governance/PhaseGate.js';
// Note: We are reusing the pure transition logic for now, but wrapping it in the Engine class.

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
            lastPracticeDate: null
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
            lastPracticeDate: null
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
        }

        // Update Internal Engine State
        this.currentState = state;

        // Update Institution State (Read Model)
        this.kernel.state.update('standing', {
            state: state.state,
            integrity: 100 - state.entropy, // Derived Integrity
            streak: state.streak,
            lastPracticeDate: state.lastPracticeDate
        });

        console.log(`ICE: Standing Computed -> ${state.state} (Streak: ${state.streak})`);
    }

    getCurrentStanding() {
        return { ...this.currentState };
    }
}
