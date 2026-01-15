/**
 * Harness Module: Decision Engine
 * Role: Implementation of FITNESS_DAILY_DECISION_V1 and other behavioral logic.
 */
export class DecisionEngine {
    constructor(randomizer) {
        this.randomizer = randomizer || Math;
    }

    /**
     * Executes the decision logic for an actor.
     * @param {string} engineId 
     * @param {object} context - { standing, phase, physiology, behavior, history }
     * @returns {string} One of the defined outputs
     */
    decide(engineId, context) {
        if (engineId === 'FITNESS_DAILY_DECISION_V1') {
            return this.executeFitnessDecisionV1(context);
        }
        throw new Error(`Unknown Decision Engine: ${engineId}`);
    }

    executeFitnessDecisionV1(context) {
        const { standing, phase, physiology, behavior, history } = context;
        const { complianceBias, motivationVolatility, honestyFactor, restAversion } = behavior;
        const { capacity, load } = physiology;

        // 1. Check for Injury (Risk increases with load and lower threshold)
        const injuryProb = this.calculateInjuryProbability(load, physiology.injuryThreshold);
        if (this.roll(injuryProb)) {
            return 'INJURY_DECLARED';
        }

        // 2. Decide between Training, Recovery, and Rest
        // In GENESIS, follow specific sequence
        if (phase === 'GENESIS') {
            if (!history.some(e => e.type === 'BASELINE_DECLARED')) return 'BASELINE_DECLARED';
            if (!history.some(e => e.type === 'OATH_TAKEN')) return 'OATH_TAKEN';
            if (!history.some(e => e.type === 'GENESIS_VERDICT_SUBMITTED')) return 'GENESIS_VERDICT_SUBMITTED';
            return 'NO_EVENT';
        }

        // Normal operation
        const stress = load / 100;
        const trainProb = this.calculateTrainProbability(standing.index, complianceBias, motivationVolatility);
        const recoverProb = this.calculateRecoverProbability(stress, physiology.recoveryRate, restAversion);

        // Roll for training
        if (this.roll(trainProb)) {
            // Roll for honesty
            const dishonestyProb = this.calculateDishonestyProbability(honestyFactor, stress);
            if (this.roll(dishonestyProb)) {
                return 'DISHONEST_LOG';
            }
            return 'TRAINING_COMPLETED';
        }

        // Roll for recovery if stressed
        if (stress > 0.4 && this.roll(recoverProb)) {
            return 'RECOVERY_COMPLETED';
        }

        // Roll for rest
        if (this.roll(0.5)) {
            return 'REST_OBSERVED';
        }

        // Otherwise, session missed
        return 'SESSION_MISSED';
    }

    calculateTrainProbability(standingIndex, complianceBias, motivationVolatility) {
        // Base probability from compliance
        let prob = complianceBias;

        // Standing index influence (positive reinforcement)
        // Adversarial behavior: Some personas (MINIMALIST) might ignore standing
        if (complianceBias > 0.3) {
            prob += (standingIndex - 0.5) * 0.2;
        }

        // Volatility adds noise
        prob += (this.randomizer.random() - 0.5) * motivationVolatility;
        return Math.max(0.01, Math.min(0.99, prob));
    }

    calculateRecoverProbability(stress, recoveryRate, restAversion) {
        // High stress and high recovery rate increase recovery probability
        let prob = (stress * 0.6) + (recoveryRate * 0.4);
        // Rest aversion decreases it
        prob -= restAversion * 0.3;
        return Math.max(0, Math.min(1.0, prob));
    }

    calculateDishonestyProbability(honestyFactor, stress) {
        // Lower honesty factor and higher stress increase dishonesty
        // LIAR archetype will have very low honestyFactor
        let prob = (1 - honestyFactor) * 0.7 + (stress * 0.3);
        return Math.max(0, Math.min(1.0, prob));
    }

    calculateInjuryProbability(load, injuryThreshold) {
        // Risk spikes as load approaches/exceeds threshold
        const loadFactor = load / 100;
        if (loadFactor < injuryThreshold - 0.2) return 0.001; // Base risk

        const excess = Math.max(0, loadFactor - (injuryThreshold - 0.1));
        // OVERFITTER will constantly hit this
        return Math.min(0.5, 0.01 + excess * 3);
    }

    roll(probability) {
        return this.randomizer.random() < probability;
    }
}
