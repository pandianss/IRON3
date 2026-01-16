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
        console.group("ICE: Fitness Engine Processing");
        const state = this.kernel.state;
        const physiology = state.getDomain('physiology') || { load: 0, capacity: 50 };
        const history = this.kernel.ledger.getHistory();
        const scenario = this.kernel.scenario;

        // --- CONSTITUTIONAL LIFECYCLE STATE ---
        // Recover state or initialize default
        let lifecycle = this.state?.lifecycle || 'GENESIS';
        let baselineSI = this.state?.baselineSI || null;
        let activeDays = this.state?.activeDays || 0;
        let consecutivePositiveEvents = this.state?.consecutivePositiveEvents || 0;

        const fitnessEvents = history.filter(e =>
            ['SESSION_ENDED', 'RECOVERY_VALIDATED', 'AUTHORITY_REALIGNED', 'MODULE_ACTIVATED', 'TRAINING_COMPLETED', 'RECOVERY_COMPLETED', 'SESSION_MISSED'].includes(e.type)
        );

        console.log(`ICE: Fitness Events Found: ${fitnessEvents.length}`);

        // 1. Stress & Recovery (Physiological)
        let S = Math.min(1.0, (physiology.load || 0) / 100);
        let R = Math.min(1.0, (physiology.capacity || 50) / 100);

        // 2. Continuity & Integrity (History Replay)
        let C = this.state?.continuity ?? FC00_CONTRACT.seeding.continuity;
        let I = this.state?.integrity ?? FC00_CONTRACT.seeding.integrity;
        let lastTimestamp = null;
        let workingActiveDays = 0;
        let workingConsecutive = 0;

        // Replay history for SI calculation AND Lifecycle counting
        fitnessEvents.forEach(event => {
            const timestamp = new Date(event.meta?.timestamp || event.timestamp);

            // Count unique active days
            if (lastTimestamp && timestamp.getDate() !== lastTimestamp.getDate()) {
                workingActiveDays++;
            }
            lastTimestamp = timestamp;

            // Decay
            if (lastTimestamp) {
                const hoursPassed = (timestamp - lastTimestamp) / (1000 * 60 * 60);
                if (hoursPassed > 24) {
                    C -= Math.min(C, (hoursPassed / 168) * 0.2);
                }
            }

            // Updates + Lifecycle Triggers
            switch (event.type) {
                case 'MODULE_ACTIVATED':
                    if (event.payload.moduleId === 'FITNESS_RECOVERY') {
                        C = 0.5; I = 1.0;
                    }
                    // Trigger: GENESIS confirmation (if needed, though usually implicit)
                    break;

                case 'TRAINING_COMPLETED':
                case 'SESSION_ENDED':
                    C = Math.min(1.0, C + 0.05);
                    I = Math.min(1.0, I + 0.01);
                    workingConsecutive++;

                    // Trigger: PROBATION (First real commitment)
                    if (lifecycle === 'GENESIS') {
                        lifecycle = 'PROBATION';
                        console.log("ICE: Constitutional Promotion -> PROBATION");
                    }
                    break;

                case 'RECOVERY_VALIDATED':
                case 'RECOVERY_COMPLETED':
                    I = Math.min(1.0, I + 0.02);
                    workingConsecutive++;
                    break;

                case 'SESSION_MISSED':
                    I = Math.max(0, I - 0.05);
                    C = Math.max(0, C - 0.1);
                    workingConsecutive = 0; // Break streak
                    break;

                case 'AUTHORITY_REALIGNED':
                    I = Math.max(0, I - 0.2);
                    workingConsecutive = 0;
                    break;
            }
        });

        // Update counters based on replay (simplified for MVP, ideally stored statefully)
        activeDays = workingActiveDays;
        consecutivePositiveEvents = workingConsecutive;

        // --- LIFECYCLE PROMOTION LOGIC ---
        // PROBATION -> ACTIVE
        if (lifecycle === 'PROBATION' && consecutivePositiveEvents >= 3) {
            lifecycle = 'ACTIVE';
            // Establish Baseline
            // In a real implementation this would be a rolling average, using current SI for MVP
            // Calculating intermediate SI here for baseline setting would require re-calc, 
            // for now we set baseline at end of loop if not set.
            console.log("ICE: Constitutional Promotion -> ACTIVE");
        }

        // ACTIVE -> DEGRADABLE
        if (lifecycle === 'ACTIVE' && activeDays >= 14) { // T=14 days
            lifecycle = 'DEGRADABLE';
            console.log("ICE: Constitutional Promotion -> DEGRADABLE");
        }


        // 3. SI Calculation
        const T = 0;
        const SI = (this.weights.wC * C) + (this.weights.wR * R) + (this.weights.wI * I) - (this.weights.wS * S) + (this.weights.wT * T);
        const finalSI = Math.max(0, Math.min(1, SI));

        // Set baseline if needed and valid
        if (lifecycle !== 'GENESIS' && !baselineSI) {
            baselineSI = finalSI;
        }

        console.log(`ICE: SI=${finalSI.toFixed(2)} | Lifecycle=${lifecycle} | ActiveDays=${activeDays}`);

        // 4. Band Calculation & Gating
        const thresholds = scenario?.thresholds || { breached: 0.2, degraded: 0.4, strained: 0.8, ascending: 0.8 };
        let rawBand = 'STABLE';
        if (finalSI < thresholds.breached) rawBand = 'BREACHED';
        else if (finalSI < thresholds.degraded) rawBand = 'DEGRADED';
        else if (S > thresholds.strained) rawBand = 'STRAINED';
        else if (finalSI > thresholds.ascending) rawBand = 'ASCENDING';

        // --- CONSTITUTIONAL GATING ---
        let finalBand = rawBand;

        // Rule V: Protect GENESIS and PROBATION
        if (lifecycle === 'GENESIS') {
            finalBand = 'STABLE';
        } else if (lifecycle === 'PROBATION' && (rawBand === 'DEGRADED' || rawBand === 'BREACHED')) {
            finalBand = 'STABLE';
        } else if (lifecycle === 'ACTIVE' && (rawBand === 'DEGRADED' || rawBand === 'BREACHED')) {
            // Rule III extension: ACTIVE is also protected until DEGRADABLE
            finalBand = 'STABLE';
        }

        // Rule IV: Redefine Degradation
        if (lifecycle === 'DEGRADABLE' && (rawBand === 'DEGRADED' || rawBand === 'BREACHED')) {
            const drop = (baselineSI || finalSI) - finalSI;
            const degradationDelta = 0.15; // Constitutionally defined
            const sustainedNegativeHistory = consecutivePositiveEvents === 0; // Simplified proxy

            // Only degrade if drop is significant AND history is negative
            if (drop < degradationDelta || !sustainedNegativeHistory) {
                finalBand = 'STABLE'; // Saved by the Constitution
                console.log("ICE: Degradation Prevented by Constitutional Shield (Drop insufficient or History positive)");
            }
        }

        console.log(`ICE: Final Band: ${finalBand} (Raw: ${rawBand})`);
        console.groupEnd();

        this.state = {
            continuity: C, stress: S, recovery: R, integrity: I, trajectory: T,
            standingIndex: finalSI,
            band: finalBand,
            // Constitutional Meta
            lifecycle, baselineSI, activeDays, consecutivePositiveEvents
        };

        this.kernel.state.update('fitnessStanding', this.state);

        // Universal Standing Update
        this.kernel.state.update('standing', {
            state: finalBand,
            integrity: Math.round(I * 100),
            index: finalSI,
            vectors: this.state,
            lifecycle: lifecycle // <--- Universal Property
        });
    }

    getSnapshot() {
        return { ...this.state };
    }
}
