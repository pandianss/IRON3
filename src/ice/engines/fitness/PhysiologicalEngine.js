import { CapacityEngine } from '../../../domain/fitness/CapacityEngine.js';
import { RecoveryLaw } from '../../../domain/fitness/RecoveryLaw.js';
import { DeloadLogic } from '../../../domain/fitness/DeloadLogic.js';

/**
 * PHYSIOLOGICAL ENGINE
 * 
 * The ICE component responsible for translating biological signals 
 * into institutional authority.
 */
export class PhysiologicalEngine {
    constructor(kernel) {
        this.kernel = kernel;
    }

    process() {
        const state = this.kernel.state;
        const ledger = this.kernel.ledger.getHistory();

        const currentPhysio = state.getDomain('physiology') || { era: 'PEAK' };

        // 1. Resolve Era (Deload or Performance)
        const transition = DeloadLogic.evaluateTransition(currentPhysio);
        const activeEra = transition || currentPhysio.era || 'PEAK';
        const params = DeloadLogic.getParameters(activeEra);

        // 2. Filter fitness-relevant events
        const fitnessEvents = ledger.filter(e =>
            ['SESSION_ENDED', 'RECOVERY_VALIDATED', 'HEART_RATE_VARIABILITY'].includes(e.type)
        );

        // 3. Calculate Capacity (Factoring in Deload multipliers)
        const capacity = CapacityEngine.calculate(fitnessEvents, state.getDomain('standing'), params);

        // 4. Apply Recovery Law to current intent
        const sessionDomain = state.getDomain('session');
        const intent = sessionDomain?.status === 'PENDING' ? { type: 'START_SESSION' } : { type: 'IDLE' };

        // Special case: check if we just ended a session that exceeded deload cap
        const lastEvent = ledger[ledger.length - 1];
        const evaluationPayload = (lastEvent?.type === 'SESSION_ENDED') ? { type: 'SESSION_ENDED', duration: lastEvent.payload.duration } : intent;

        const lawResult = RecoveryLaw.evaluateIntent(capacity, evaluationPayload, params);

        // 5. Update Engine State
        state.update('physiology', {
            era: activeEra,
            capacity: capacity.value,
            load: capacity.load,
            status: capacity.status,
            law: lawResult,
            params: params // Expose params for UI visibility
        });

        // 6. Standing Penalty for "Breaching Rest" or "Exceeding Deload Cap"
        if (!lawResult.isAuthorized) {
            const standing = state.getDomain('standing');
            state.update('standing', {
                integrity: Math.max(0, (standing?.integrity || 100) - 20)
            });
        }
    }
}

