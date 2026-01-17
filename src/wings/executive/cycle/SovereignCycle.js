/**
 * ICE Module 9: Institutional Cycle
 * Role: Loop Controller.
 * Responsibilities:
 * - Atomic execution of the Evaluation Pipeline.
 * - Enforce Invariant Order: Contract -> Standing -> Authority -> Mandate.
 * - Seal the cycle.
 */
export class SovereignCycle {
    constructor(kernel) {
        this.kernel = kernel;
    }

    /**
     * Runs the full evaluation pipeline.
     * @returns {Promise<object>} The Result Snapshot
     */
    async run() {
        console.group("SOVEREIGN: Evaluation Cycle Start");

        try {
            // Step 0: Phase Resolution (Determining Legal Regime)
            const phase = this.kernel.phaseController.evaluatePhase();

            // Step 1: Legal Evaluation (Contracts)
            // Contracts activate/retire based on new conditions
            this.kernel.engines.contract.evaluateActivations();

            // Step 2: Constitutional Evaluation (Standing)
            // Standing is re-derived from history
            this.kernel.engines.standing.computeStanding();

            // Step 3: Governance (Authority)
            // Permissions are locked/unlocked based on new Standing/Contracts
            this.kernel.engines.authority.resolveAuthority();

            // Step 4: Experience (Mandates)
            // UI instructions are generated
            const mandates = this.kernel.engines.mandate.generateMandates();

            console.groupEnd();
            return {
                success: true,
                mandates
            };

        } catch (error) {
            console.error("SOVEREIGN: Cycle Failure", error);
            console.groupEnd();
            throw error;
        }
    }
}
