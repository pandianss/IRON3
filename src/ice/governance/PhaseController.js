/**
 * ICE Module: Phase Controller
 * Role: The Legal Calendar.
 * Responsibilities:
 * - Manage Institutional Phases (GENESIS, PROBATION, ACTIVE).
 * - Trigger Phase Transitions based on Ledger History.
 */
export class PhaseController {
    constructor(kernel) {
        this.kernel = kernel;
    }

    /**
     * Resolves the current phase based on ledger history.
     * Transitions:
     * GENESIS -> PROBATION (at first meaningful event, e.g. CONTRACT_CREATED/OATH_TAKEN)
     * PROBATION -> ACTIVE (after observation period or completion of induction steps)
     */
    evaluatePhase() {
        const history = this.kernel.ledger.getHistory();
        const currentStanding = this.kernel.state.getDomain('standing');
        const phaseModel = this.kernel.scenario?.phaseModel || {};
        const currentPhaseObj = this.kernel.state.getDomain('phase') || { id: 'GENESIS' };

        let phase = currentPhaseObj.id;

        // Helper to get days in current phase
        const getDaysInPhase = (p) => {
            // Very simplified: counting daily events since last phase change or start
            // In a real system we'd track phase transition timestamps
            return history.filter(e => e.type === 'DAILY_EVALUATION').length; // Placeholder
        };

        // 1. GENESIS -> PROBATION
        if (phase === 'GENESIS') {
            const hasStarted = history.some(e => e.type === 'GENESIS_VERDICT_SUBMITTED');
            const genesisConfig = phaseModel['GENESIS'];
            const daysInGenesis = getDaysInPhase('GENESIS');

            if (hasStarted || (genesisConfig?.maxDays && daysInGenesis >= genesisConfig.maxDays)) {
                phase = 'PROBATION';
            }
        }

        // 2. PROBATION -> ACTIVE
        if (phase === 'PROBATION') {
            const activated = history.some(e => e.type === 'INSTITUTION_ACTIVATED');
            const probationConfig = phaseModel['PROBATION'];
            const daysInProbation = getDaysInPhase('PROBATION');

            // Regression Fix: Ensure automatic progression after observation period
            if (activated || (probationConfig?.minDays && daysInProbation >= probationConfig.minDays)) {
                phase = 'ACTIVE';
            }
        }

        // 3. Status Overrides (DEGRADED / REHAB)
        if (phase === 'ACTIVE' || phase === 'DEGRADED' || phase === 'REHABILITATING') {
            if (currentStanding.state === 'BREACHED' || currentStanding.state === 'VIOLATED') {
                phase = 'DEGRADED';
            } else if (currentStanding.state === 'RECOVERY') {
                phase = 'REHABILITATING';
            } else if (phase === 'REHABILITATING' && currentStanding.state === 'STABLE') {
                phase = 'ACTIVE';
            }
        }

        this.kernel.state.update('phase', {
            id: phase,
            label: phase
        });

        console.log(`ICE: Phase Evaluated -> ${phase}`);
        return phase;
    }
}
