import { ConditionResolver } from '../../legislative/contracts/ConditionResolver.js';

/**
 * SOVEREIGN Module: Contract Engine
 * Role: The Legal System.
 */
export class ContractEngine {
    constructor(kernel) {
        this.kernel = kernel;
        this.resolver = new ConditionResolver(kernel);

        this.registry = []; // Should be populated by Legislative Wing
        this.activeContracts = new Set();
        this.obligations = [];
    }

    /**
     * Cycle Step 1: Check Activations
     * Evaluates all contracts in registry. If conditions met, activate.
     * If conditions fail, retire (if active).
     */
    evaluateActivations() {
        this.registry.forEach(contract => {
            const isMet = this.resolver.evaluate(contract.activation.when);

            if (isMet && !this.activeContracts.has(contract.id)) {
                this.activate(contract);
            } else if (!isMet && this.activeContracts.has(contract.id)) {
                this.retire(contract);
            }
        });
    }

    activate(contract) {
        console.log(`ICE: Contract Activated [${contract.id}]`);
        this.activeContracts.add(contract.id);

        // Register Obligations
        if (contract.obligations) {
            this.obligations.push(...contract.obligations.map(o => ({
                ...o,
                contractId: contract.id,
                status: 'PENDING'
            })));
        }
    }

    retire(contract) {
        console.log(`ICE: Contract Retired [${contract.id}]`);
        this.activeContracts.delete(contract.id);
        // Remove Obligations? Or mark as void?
        this.obligations = this.obligations.filter(o => o.contractId !== contract.id);
    }

    /**
     * Cycle Step 2: Check Compliance
     * Looks at Ledger for 'requiredEvent' within 'window'.
     */
    evaluateCompliance() {
        // Stub: This usually runs complex window logic (Daily, etc)
        // For now, we assume external logic or simple query handles this
    }

    getActiveObligations() {
        return [...this.obligations];
    }
}
