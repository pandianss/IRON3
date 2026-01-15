import { CapacityEngine } from '../../../domain/fitness/CapacityEngine';
import { RecoveryLaw } from '../../../domain/fitness/RecoveryLaw';

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
        const ledger = this.kernel.ledger;

        // 1. Filter fitness-relevant events
        const fitnessEvents = ledger.filter(e =>
            ['SESSION_ENDED', 'RECOVERY_VALIDATED', 'HEART_RATE_VARIABILITY'].includes(e.type)
        );

        // 2. Calculate Capacity
        const capacity = CapacityEngine.calculate(fitnessEvents, state.standing);

        // 3. Apply Recovery Law to current intent
        const intent = state.session?.status === 'PENDING' ? 'START_SESSION' : 'IDLE';
        const lawResult = RecoveryLaw.evaluateIntent(capacity, intent);

        // 4. Update Engine State
        // We attach these to a new 'physiology' domain in the state
        state.physiology = {
            capacity: capacity.value,
            load: capacity.load,
            status: capacity.status,
            law: lawResult
        };

        // 5. Standing Penalty for "Breaching Rest"
        if (intent === 'START_SESSION' && !lawResult.isAuthorized) {
            // This would normally trigger a full transition in the StandingEngine.
            // For now, we flag it for the Cycle to pick up.
            state.standing.integrity = Math.max(0, state.standing.integrity - 20);
        }
    }
}
