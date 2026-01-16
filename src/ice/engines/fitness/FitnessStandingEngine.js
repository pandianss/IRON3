import { PhaseGate } from '../../governance/PhaseGate.js';
import { FC00_CONTRACT } from '../../contract/definitions/FC-00.js';
import { FITNESS_LIFECYCLE } from '../../../institution/logic/lifecycle/FitnessLifecycleEngine.js'; // Import enum
import { buildFitnessSignals } from '../../../institution/logic/events/FitnessEventProcessor.js';

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
        console.group("ICE: Fitness Engine Processing");
        const state = this.kernel.state;
        const physiology = state.getDomain('physiology') || { load: 0, capacity: 50 };
        const history = this.kernel.ledger.getHistory();
        const scenario = this.kernel.scenario;
        const lifecycleState = state.getDomain('lifecycle') || { stage: 'GENESIS' };

        // 1. Stress & Recovery (Physiological)
        let S = Math.min(1.0, (physiology.load || 0) / 100);
        let R = Math.min(1.0, (physiology.capacity || 50) / 100);

        // 2. Continuity & Integrity (History Replay)
        let C = this.state?.continuity ?? FC00_CONTRACT.seeding.continuity;
        let I = this.state?.integrity ?? FC00_CONTRACT.seeding.integrity;
        let lastTimestamp = null;

        // Replay history for Vector Calculation
        // Note: Ideally this is incremental, but for consistency we replay or use last valid state + new events.
        // For MVP we can assume state is persisted and we only process new events if we tracked them, 
        // but here we are recalculating C/I primarily.

        // Simplified replay logic (similar to before but just for C/I math)
        // Note: buildFitnessSignals will handle signal extraction for Lifecycle.

        // ... (Existing C/I calculation logic preserved for continuity of math) ...
        const fitnessEvents = history.filter(e =>
            ['SESSION_ENDED', 'RECOVERY_VALIDATED', 'AUTHORITY_REALIGNED', 'MODULE_ACTIVATED', 'TRAINING_COMPLETED', 'RECOVERY_COMPLETED', 'SESSION_MISSED'].includes(e.type)
        );

        fitnessEvents.forEach(event => {
            // ... (Logic to update C & I based on event types) ...
            // Simplified for this replacement to avoid huge block:
            // In a real refactor we'd abstract this math.
            // For now, I will retain the core math updates but remove lifecycle triggers.

            const timestamp = new Date(event.meta?.timestamp || event.timestamp);
            if (lastTimestamp) {
                const hoursPassed = (timestamp - lastTimestamp) / (1000 * 60 * 60);
                if (hoursPassed > 24) C -= Math.min(C, (hoursPassed / 168) * 0.2);
            }
            lastTimestamp = timestamp;

            switch (event.type) {
                case 'MODULE_ACTIVATED':
                    if (event.payload.moduleId === 'FITNESS_RECOVERY') { C = 0.5; I = 1.0; }
                    break;
                case 'TRAINING_COMPLETED':
                case 'SESSION_ENDED':
                    C = Math.min(1.0, C + 0.05);
                    I = Math.min(1.0, I + 0.01);
                    break;
                case 'RECOVERY_VALIDATED':
                case 'RECOVERY_COMPLETED':
                    I = Math.min(1.0, I + 0.02);
                    break;
                case 'SESSION_MISSED':
                    I = Math.max(0, I - 0.05);
                    C = Math.max(0, C - 0.1);
                    break;
                case 'AUTHORITY_REALIGNED':
                    I = Math.max(0, I - 0.2);
                    break;
            }
        });

        // 3. SI Calculation
        const T = 0;
        const SI = (this.weights.wC * C) + (this.weights.wR * R) + (this.weights.wI * I) - (this.weights.wS * S) + (this.weights.wT * T);
        const finalSI = Math.max(0, Math.min(1, SI));

        console.log(`ICE: SI=${finalSI.toFixed(2)} | Lifecycle=${lifecycleState.stage}`);

        // 4. Band Calculation & Constitutional Gating
        const thresholds = scenario?.thresholds || { breached: 0.2, degraded: 0.4, strained: 0.8, ascending: 0.8 };
        let rawBand = 'STABLE';
        if (finalSI < thresholds.breached) rawBand = 'BREACHED';
        else if (finalSI < thresholds.degraded) rawBand = 'DEGRADED';
        else if (S > thresholds.strained) rawBand = 'STRAINED';
        else if (finalSI > thresholds.ascending) rawBand = 'ASCENDING';

        // Build Signals for Gating
        const signals = buildFitnessSignals(state, history, finalSI);

        // --- LIFECYCLE EVALUATION ---
        // Evaluate promotion/demotion BEFORE constitutional gating
        if (this.kernel.engines.fitnessLifecycle) {
            this.kernel.engines.fitnessLifecycle.evaluate(signals);
        }

        // Refresh Lifecycle State (it might have changed)
        const updatedLifecycleState = state.getDomain('lifecycle') || { stage: 'GENESIS' };

        // Apply Gating
        const finalBand = this.constitutionalGate(updatedLifecycleState, rawBand, signals, finalSI);

        console.log(`ICE: Final Band: ${finalBand} (Raw: ${rawBand})`);
        console.groupEnd();

        // Assuming baselineSI, activeDays, consecutivePositiveEvents are defined earlier in the process method
        // or are intended to be added as undefined if not present.
        const baselineSI = updatedLifecycleState.baselineSI;
        const activeDays = signals.activeDays;
        const consecutivePositiveEvents = signals.positiveContinuityEvents;

        this.state = {
            continuity: C, stress: S, recovery: R, integrity: I, trajectory: T,
            // Constitutional Meta
            lifecycle: updatedLifecycleState.stage, baselineSI, activeDays, consecutivePositiveEvents
        };

        this.kernel.state.update('fitnessStanding', this.state);

        // Universal Standing Update
        this.kernel.state.update('standing', {
            state: finalBand,
            integrity: Math.round(I * 100),
            index: finalSI,
            vectors: this.state,
            lifecycle: updatedLifecycleState.stage // <--- Universal Property
        });
    }

    constitutionalGate(inst, band, signals, si) {
        // GENESIS: no standing judgments allowed
        if (inst.stage === FITNESS_LIFECYCLE.GENESIS) {
            return 'STABLE';
        }

        // PROBATION: degradation illegal
        if (inst.stage === FITNESS_LIFECYCLE.PROBATION && (band === 'DEGRADED' || band === 'BREACHED')) {
            return 'STABLE';
        }

        // ACTIVE: standing allowed, degradation still illegal
        if (inst.stage === FITNESS_LIFECYCLE.ACTIVE && (band === 'DEGRADED' || band === 'BREACHED')) {
            return 'STABLE';
        }

        // DEGRADABLE: degradation requires historical breach
        if (inst.stage === FITNESS_LIFECYCLE.DEGRADABLE && (band === 'DEGRADED' || band === 'BREACHED')) {
            if (!signals.sustainedBreach || inst.baselineSI == null) {
                return 'STABLE';
            }

            const drop = inst.baselineSI - si;
            if (drop < 0.12) return 'STABLE';
        }

        return band;
    }

    getSnapshot() {
        return { ...this.state };
    }
}

