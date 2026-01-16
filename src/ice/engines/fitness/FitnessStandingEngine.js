import { PhaseGate } from '../../governance/PhaseGate.js';
import { FC00_CONTRACT } from '../../contract/definitions/FC-00.js';
import { FITNESS_LIFECYCLE } from '../../../core/contracts/FC-FIT-01-LIFECYCLE.js';
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

        this.state = {
            ...this.vectors,
            standingIndex: 0.5,
            band: 'STABLE',
            degradedSince: null
        };

        this.recovery = { phase: null, daysInPhase: 0 };
    }

    /**
     * Compute current standing from history
     */
    process() {
        console.group("ICE: Fitness Engine Processing");
        const state = this.kernel.state;
        const physiology = state.getDomain('physiology') || { load: 0, capacity: 100 };
        const history = this.kernel.ledger.getHistory();
        const scenario = this.kernel.scenario;

        // 1. Vector Calculation
        let S = Math.min(1.0, (physiology.load || 0) / 100);
        let R = Math.min(1.0, (physiology.capacity || 100) / 100);
        let C = this.state?.continuity ?? FC00_CONTRACT.seeding.continuity;
        let I = this.state?.integrity ?? FC00_CONTRACT.seeding.integrity;
        let lastTimestamp = null;

        const fitnessEvents = history.filter(e =>
            ['SESSION_ENDED', 'RECOVERY_VALIDATED', 'AUTHORITY_REALIGNED', 'MODULE_ACTIVATED', 'TRAINING_COMPLETED', 'RECOVERY_COMPLETED', 'SESSION_MISSED'].includes(e.type)
        );

        fitnessEvents.forEach(event => {
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

        // 2. SI Calculation
        const T = 0;
        const SI = (this.weights.wC * C) + (this.weights.wR * R) + (this.weights.wI * I) - (this.weights.wS * S) + (this.weights.wT * T);
        const finalSI = Math.max(0, Math.min(1, SI));

        // 3. Band Calculation & Signals
        const thresholds = scenario?.thresholds || { breached: 0.2, degraded: 0.4, strained: 0.8, ascending: 0.8 };
        let rawBand = 'STABLE';
        if (finalSI < thresholds.breached) rawBand = 'BREACHED';
        else if (finalSI < thresholds.degraded) rawBand = 'DEGRADED';
        else if (S > thresholds.strained) rawBand = 'STRAINED';
        else if (finalSI > thresholds.ascending) rawBand = 'ASCENDING';

        const signals = buildFitnessSignals(state, history, finalSI);
        const prevDegradedSince = this.state.degradedSince;
        signals.degradedDays = prevDegradedSince
            ? Math.floor((Date.now() - prevDegradedSince) / (1000 * 60 * 60 * 24))
            : 0;

        // 4. Lifecycle Evaluation
        if (this.kernel.engines.fitnessLifecycle) {
            this.kernel.engines.fitnessLifecycle.evaluate(signals);
        }

        const updatedLifecycleState = state.getDomain('lifecycle') || { stage: 'GENESIS' };

        // 5. Constitutional Gating
        const gateResult = this.constitutionalGate(updatedLifecycleState, rawBand, signals, finalSI);
        const finalBand = gateResult.band;
        const evidence = gateResult.evidence;

        // 6. Update Degradation Timer
        const isDegraded = finalBand === 'DEGRADED' || finalBand === 'BREACHED';
        if (isDegraded && !this.state.degradedSince) {
            this.state.degradedSince = Date.now();
        } else if (!isDegraded) {
            this.state.degradedSince = null;
        }

        // 7. Recovery Protocol
        const recoveryPhase = this.manageRecovery(updatedLifecycleState, finalBand, signals);

        console.log(`ICE: SI=${finalSI.toFixed(2)} | Band=${finalBand} | Lifecycle=${updatedLifecycleState.stage}`);
        console.groupEnd();

        // 8. State Persistence & Governed Update
        const baselineSI = updatedLifecycleState.baselineSI || 0.5;
        const activeDays = signals.activeDays || 0;
        const consecutivePositiveEvents = signals.consecutivePositiveEvents || 0;

        this.state = {
            continuity: C, stress: S, recovery: R, integrity: I, trajectory: T,
            lifecycle: updatedLifecycleState.stage, baselineSI, activeDays, consecutivePositiveEvents,
            recovery: this.recovery,
            degradedSince: this.state.degradedSince
        };

        const standingAction = {
            type: 'STANDING_UPDATE_STATUS',
            payload: {
                state: finalBand,
                integrity: Math.round(I * 100),
                index: finalSI,
                vectors: this.state,
                lifecycle: updatedLifecycleState.stage,
                reason: "Ledger Recalculation",
                evidence: evidence,
                recoveryPhase: recoveryPhase,
                recovery: this.recovery
            },
            actor: 'FitnessStandingEngine',
            rules: ['R-STND-01', 'R-STND-02', 'R-STND-03', 'R-STND-04']
        };

        this.kernel.complianceKernel.getGate().govern(standingAction, () => {
            this.kernel.state.update('fitnessStanding', this.state);
            this.kernel.state.update('standing', standingAction.payload);
        }).catch(e => {
            console.error("ICE: Standing Update Blocked", e.message);
        });
    }

    constitutionalGate(inst, band, signals, si) {
        if (inst.stage === FITNESS_LIFECYCLE.GENESIS) {
            return { band: 'PRE_INDUCTION', evidence: null };
        }
        if (inst.stage === FITNESS_LIFECYCLE.PROBATION && (band === 'DEGRADED' || band === 'BREACHED')) {
            return { band: 'STABLE', evidence: null };
        }
        if (inst.stage === FITNESS_LIFECYCLE.ACTIVE && (band === 'DEGRADED' || band === 'BREACHED')) {
            return { band: 'STABLE', evidence: null };
        }
        if (inst.stage === FITNESS_LIFECYCLE.DEGRADABLE && (band === 'DEGRADED' || band === 'BREACHED')) {
            const evidence = {
                continuityBreach: {
                    detected: signals.missedCommitments >= 3 || signals.continuityIndex < 0.3,
                    details: `Missed: ${signals.missedCommitments}`
                },
                stressDominance: {
                    detected: signals.stress > signals.recovery * 1.5,
                    details: `Stress ${signals.stress} > Rec ${signals.recovery}`
                },
                standingLoss: {
                    detected: (inst.baselineSI - si) > 0.15,
                    details: `Drop: ${(inst.baselineSI - si).toFixed(2)}`
                },
                integrityFailure: {
                    detected: signals.integrity < 0.5,
                    details: `Integrity: ${signals.integrity}`
                },
                adjudicativeConfirmation: {
                    detected: true,
                    details: "Engine Logic Triggered"
                }
            };
            return { band: band, evidence: evidence };
        }
        return { band: band, evidence: null };
    }

    manageRecovery(inst, currentBand, signals) {
        if (currentBand !== 'DEGRADED' && currentBand !== 'BREACHED') {
            this.recovery = { phase: null, daysInPhase: 0 };
            return null;
        }

        if (!this.recovery || !this.recovery.phase) {
            this.recovery = { phase: 'STABILIZATION', daysInPhase: 0 };
        } else {
            this.recovery.daysInPhase++;
        }

        const phase = this.recovery.phase;
        let nextPhase = phase;

        switch (phase) {
            case 'STABILIZATION':
                if (signals.stress < signals.recovery && signals.positiveContinuityEvents > 0) {
                    if (this.recovery.daysInPhase >= 3) nextPhase = 'RECONSTITUTION';
                }
                break;
            case 'RECONSTITUTION':
                if (signals.continuityIndex > 0.4 && signals.missedCommitments === 0) {
                    if (this.recovery.daysInPhase >= 7) nextPhase = 'REINTEGRATION';
                }
                break;
            case 'REINTEGRATION':
                if (signals.integrity > 0.8) {
                    if (this.recovery.daysInPhase >= 5) nextPhase = 'REVALIDATION';
                }
                break;
            case 'REVALIDATION':
                if (signals.positiveContinuityEvents >= 5) {
                    nextPhase = 'COMPLETED';
                }
                break;
        }

        if (nextPhase !== phase) {
            this.recovery.phase = nextPhase;
            this.recovery.daysInPhase = 0;
        }

        return this.recovery.phase;
    }

    getSnapshot() {
        return { ...this.state, recovery: this.recovery };
    }
}
