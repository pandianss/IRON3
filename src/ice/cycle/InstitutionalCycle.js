/**
 * ICE Module 9: Institutional Cycle
 * Role: Loop Controller.
 * Responsibilities:
 * - Atomic execution of the Evaluation Pipeline.
 * - Enforce Invariant Order: Contract -> Standing -> Authority -> Mandate.
 * - Seal the cycle.
 */
export class InstitutionalCycle {
    constructor(kernel) {
        this.kernel = kernel;
    }

    /**
     * Runs the full evaluation pipeline.
     * @returns {Promise<object>} The Result Snapshot
     */
    async run() {
        console.group("ICE: Institutional Cycle Start");

        try {
            // Step 0: Ledger is already updated by Kernel.ingest()

            // Step 0.5: Session Tracking (Is the user acting now?)
            this.kernel.engines.session.process();

            // Step 1: Legal Evaluation (Contracts)
            // Contracts activate/retire based on new conditions
            this.kernel.engines.contract.evaluateActivations();
            // Compliance is checked (did the new event satisfy an obligation?)
            // this.kernel.engines.contract.evaluateCompliance(); 

            // Step 2: Constitutional Evaluation (Standing)
            // Standing is re-derived from history (including any new Contract outcomes)
            this.kernel.engines.standing.computeStanding();

            // Step 3: Governance (Authority)
            // Permissions are locked/unlocked based on new Standing/Contracts
            this.kernel.engines.authority.resolveAuthority();

            // Step 4: Experience (Mandates)
            // UI instructions are generated
            const mandates = this.kernel.engines.mandate.generateMandates();

            // Step 5: Seal & Snapshot
            // (Implicit in state update for MVP)

            console.groupEnd();
            return {
                success: true,
                mandates
            };

        } catch (error) {
            console.error("ICE: Cycle Failure", error);
            console.groupEnd();
            throw error;
        }
    }
}
