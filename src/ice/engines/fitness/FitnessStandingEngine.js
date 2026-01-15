import { PhaseGate } from '../../governance/PhaseGate.js';
import { FC00_CONTRACT } from '../../contract/definitions/FC-00.js';

/**
 * FITNESS STANDING ENGINE
 * 
 * Implements the 5-vector model: Continuity, Stress, Recovery, Integrity, Trajectory.
 * SI = wC*C + wR*R + wI*I – wS*S + wT*T
 */
export class FitnessStandingEngine {
    constructor(kernel) {
        this.kernel = kernel;

        // Weight distribution (scenario overrides)
        const scenarioWeights = this.kernel.scenario?.weights || {};
        this.weights = {
            wC: scenarioWeights.wC ?? 0.3,
            wR: scenarioWeights.wR ?? 0.2,
            wI: scenarioWeights.wI ?? 0.3,
            wS: scenarioWeights.wS ?? 0.3, // Subtracted
            wT: scenarioWeights.wT ?? 0.1
        };

        // Initial vector values (Seeded by FC-00)
        this.vectors = {
            continuity: FC00_CONTRACT.seeding.continuity,
            stress: FC00_CONTRACT.seeding.stress,
            recovery: FC00_CONTRACT.seeding.recovery,
            integrity: FC00_CONTRACT.seeding.integrity,
            trajectory: FC00_CONTRACT.seeding.trajectory
        };

        // Guard the initial state
        const phase = this.kernel.state.getDomain('phase')?.id || 'GENESIS';
        this.vectors = PhaseGate.guardMutation(phase, this.vectors);

        this.state = {
            ...this.vectors,
            standingIndex: 0.5,
            band: 'STABLE'
        };
    }

    /**
     * Compute current standing from history
     */
    process() {
        const state = this.kernel.state;
        const physiology = state.getDomain('physiology') || {};
        const history = this.kernel.ledger.getHistory();
        const scenario = this.kernel.scenario;

        const fitnessEvents = history.filter(e =>
            ['SESSION_ENDED', 'RECOVERY_VALIDATED', 'AUTHORITY_REALIGNED', 'MODULE_ACTIVATED', 'TRAINING_COMPLETED', 'RECOVERY_COMPLETED', 'SESSION_MISSED'].includes(e.type)
        );

        // 1. Stress Vector (S) - Directly from Physiological Load
        // Load is typically 0-100 (where 100 is high exhaustion)
        let S = Math.min(1.0, (physiology.load || 0) / 100);

        // 2. Recovery Vector (R) - From Physiological Capacity & Law
        let R = Math.min(1.0, (physiology.capacity || 50) / 100);

        let C = 0.5, I = 1.0;
        let lastTimestamp = null;

        fitnessEvents.forEach(event => {
            const timestamp = new Date(event.meta?.timestamp || event.timestamp);

            // 1. Time-based decay (Temporal Consistency)
            if (lastTimestamp) {
                const hoursPassed = (timestamp - lastTimestamp) / (1000 * 60 * 60);
                // Continuity Law: Decays with inactivity
                C -= Math.min(C, (hoursPassed / 168) * 0.2); // Loss of ~20% per week
            }

            // 2. Event-based updates
            switch (event.type) {
                case 'MODULE_ACTIVATED':
                    if (event.payload.moduleId === 'FITNESS_RECOVERY') {
                        C = 0.5; // Baseline established
                    }
                    break;
                case 'SESSION_ENDED':
                case 'TRAINING_COMPLETED':
                    // Continuity grows slowly
                    C = Math.min(1.0, C + 0.05);
                    // Integrity grows slightly with compliant session
                    I = Math.min(1.0, I + 0.01);
                    break;
                case 'RECOVERY_VALIDATED':
                case 'RECOVERY_COMPLETED':
                    // Integrity grows with recovery compliance
                    I = Math.min(1.0, I + 0.02);
                    break;
                case 'SESSION_MISSED':
                    // Integrity decays on missed session
                    I = Math.max(0, I - 0.05);
                    // Continuity decays faster on miss
                    C = Math.max(0, C - 0.1);
                    break;
                case 'AUTHORITY_REALIGNED':
                    // Integrity decays on breach/realignment
                    const decay = scenario?.integrityDecayMultiplier ? (0.2 * scenario.integrityDecayMultiplier) : 0.2;
                    I = Math.max(0, I - decay);
                    break;
            }

            lastTimestamp = timestamp;
        });

        // 3. Trajectory Calculation (Rolling Window comparison)
        const T = 0; // Simplified for MVP: flat trajectory

        // 4. Standing Index (SI)
        const SI = (this.weights.wC * C) +
            (this.weights.wR * R) +
            (this.weights.wI * I) -
            (this.weights.wS * S) +
            (this.weights.wT * T);

        const finalSI = Math.max(0, Math.min(1, SI));

        // 5. Institutional Bands (Scenario Overrides)
        const thresholds = scenario?.thresholds || {
            breached: 0.2,
            degraded: 0.4,
            strained: 0.8,
            ascending: 0.8
        };

        let band = 'STABLE';
        if (finalSI < thresholds.breached) band = 'BREACHED';
        else if (finalSI < thresholds.degraded) band = 'DEGRADED';
        else if (S > thresholds.strained) band = 'STRAINED';
        else if (finalSI > thresholds.ascending) band = 'ASCENDING';

        this.state = {
            continuity: C,
            stress: S,
            recovery: R,
            integrity: I,
            trajectory: T,
            standingIndex: finalSI,
            band: band
        };

        // Update Global State Read Model
        this.kernel.state.update('fitnessStanding', this.state);

        // Also update generic standing for UI compatibility
        this.kernel.state.update('standing', {
            state: band,
            integrity: Math.round(I * 100),
            index: finalSI,
            vectors: this.state
        });
    }

    getSnapshot() {
        return { ...this.state };
    }
}
