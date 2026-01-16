import { FITNESS_LIFECYCLE, FITNESS_LIFECYCLE_CONTRACT } from '../../../core/contracts/FC-FIT-01-LIFECYCLE.js';

export class FitnessLifecycleEngine {
    constructor(kernel) {
        this.kernel = kernel;
    }

    /**
     * Evaluates and updates the lifecycle state of the institution.
     * @param {Object} signals - Derived signals from history/state
     * @param {number} now - Timestamp
     */
    evaluate(signals, now = Date.now()) {
        const inst = this.kernel.state.getDomain('lifecycle') || {
            stage: FITNESS_LIFECYCLE.GENESIS,
            history: [],
            baselineSI: null,
            baselineEstablishedAt: null
        };

        const { entryConditions } = FITNESS_LIFECYCLE_CONTRACT;
        const current = inst.stage;

        for (const stage of Object.values(FITNESS_LIFECYCLE)) {
            if (stage === current) continue;

            const eligibilityFn = entryConditions[stage];
            if (!eligibilityFn) continue;

            // Pass 'inst' (state) and 'signals' to condition
            // Note: entryConditions signature in contract is (inst, signals)
            // Ideally 'inst' here should be the whole state or relevant part.
            // Contract uses 'inst.activated' etc. which might be on 'inst' object passed here or distinct.
            // Let's pass a composite object or just the lifecycle domain extended with relevant flags.
            // For now, passing 'signals' as second arg is key.
            // Let's assume 'inst' passed to condition needs to be rich enough.
            // We'll pass the kernel state snapshot effectively? Or just the lifecycle domain?
            // The contract says: GENESIS: (inst) => inst.activated === true
            // PROBATION: (inst, signals) => signals.commitmentEvents >= 1
            // So 'inst' might need 'activated' flag.

            const constitutionContext = {
                ...inst,
                activated: this.kernel.state.getDomain('phase')?.id !== 'GENESIS' // basic proxy
            };

            const eligible = eligibilityFn(constitutionContext, signals);

            if (eligible && this.isForwardPromotion(current, stage)) {
                console.log(`ICE: Lifecycle Promotion ${current} -> ${stage}`);

                inst.stage = stage;
                inst.history.push({ from: current, to: stage, at: now });

                if (stage === FITNESS_LIFECYCLE.PROBATION && !inst.baselineSI) {
                    inst.baselineSI = signals.currentSI;
                    inst.baselineEstablishedAt = now;
                }

                // Persist update
                this.kernel.state.update('lifecycle', inst);
                return; // One promotion per cycle usually enough?
            }
        }
    }

    isForwardPromotion(current, target) {
        const order = [
            FITNESS_LIFECYCLE.GENESIS,
            FITNESS_LIFECYCLE.PROBATION,
            FITNESS_LIFECYCLE.ACTIVE,
            FITNESS_LIFECYCLE.DEGRADABLE,
            FITNESS_LIFECYCLE.COLLAPSED
        ];
        return order.indexOf(target) > order.indexOf(current);
    }
}
