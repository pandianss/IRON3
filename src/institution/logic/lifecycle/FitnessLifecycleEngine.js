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
                // Step 3 & 4: Governed Contract & Compliance Gate
                const rules = this.getRulesForTransition(stage);

                const action = {
                    type: 'LIFECYCLE_PROMOTE',
                    payload: {
                        currentStage: current,
                        targetStage: stage,
                        now: now,
                        evidence: signals // Constitutional Verification
                    },
                    actor: 'FitnessLifecycleEngine',
                    rules: rules
                };

                // Execute via Constitution
                // We use an async IIFE or promise handling since evaluate is synchronous in loop?
                // Ideally evaluate should be async.
                // For now, fire and forget or assume synchronous gate for MVP logic?
                // The Gate returns a Promise if the operation is async.
                // We'll wrap it in a promise-handling block or assume async caller.

                this.kernel.complianceKernel.getGate().govern(action, async () => {
                    console.log(`ICE: Lifecycle Promotion ${current} -> ${stage}`);

                    inst.stage = stage;
                    inst.history.push({ from: current, to: stage, at: now });

                    if (stage === FITNESS_LIFECYCLE.PROBATION && !inst.baselineSI) {
                        inst.baselineSI = signals.currentSI;
                        inst.baselineEstablishedAt = now;
                    }

                    // Step 5: State Authority Binding
                    this.kernel.setState('lifecycle', inst);
                }).then(() => {
                    console.log(`ICE: Constitutional Lifecycle Transition Complete: ${stage}`);
                }).catch(e => {
                    console.error(`ICE: Constitutional Block on Promotion to ${stage}`, e.message);
                });

                return; // Attempt one promotion
            }
        }
    }

    getRulesForTransition(targetStage) {
        switch (targetStage) {
            case FITNESS_LIFECYCLE.PROBATION: return ['R-LIFE-01'];
            case FITNESS_LIFECYCLE.ACTIVE: return ['R-LIFE-02'];
            case FITNESS_LIFECYCLE.DEGRADABLE: return ['R-LIFE-03'];
            case FITNESS_LIFECYCLE.COLLAPSED: return ['R-LIFE-04'];
            default: return [];
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
