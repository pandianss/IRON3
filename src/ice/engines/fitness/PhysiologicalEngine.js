import { CapacityEngine } from '../../../domain/fitness/CapacityEngine.js';
import { RecoveryLaw } from '../../../domain/fitness/RecoveryLaw.js';

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

        // 1. Filter fitness-relevant events
        const fitnessEvents = ledger.filter(e =>
            ['SESSION_ENDED', 'RECOVERY_VALIDATED', 'HEART_RATE_VARIABILITY'].includes(e.type)
        );

        // 2. Calculate Capacity
        const capacity = CapacityEngine.calculate(fitnessEvents, state.getDomain('standing'));

        // 3. Apply Recovery Law to current intent
        const sessionDomain = state.getDomain('session');
        const intent = sessionDomain?.status === 'PENDING' ? 'START_SESSION' : 'IDLE';
        const lawResult = RecoveryLaw.evaluateIntent(capacity, intent);

        // 4. Update Engine State
        state.update('physiology', {
            capacity: capacity.value,
            load: capacity.load,
            status: capacity.status,
            law: lawResult
        });

        // 5. Standing Penalty for "Breaching Rest"
        if (intent === 'START_SESSION' && !lawResult.isAuthorized) {
            const standing = state.getDomain('standing');
            state.update('standing', {
                integrity: Math.max(0, (standing?.integrity || 100) - 20)
            });
        }
    }
}

