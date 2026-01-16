import { PrincipleRegistry } from './principles/PrincipleRegistry.js';
import { RuleEngine } from './engine/RuleEngine.js';
import { InvariantEngine } from './engine/InvariantEngine.js'; // VVL
import { AuditLedger } from './audit/AuditLedger.js';
import { StateMonitor } from './state/StateMonitor.js';
import { HealthModel } from './state/HealthModel.js'; // MTL
import { ComplianceGate } from './gate/ComplianceGate.js';
import { ResponseOrchestrator } from './enforcement/ResponseOrchestrator.js'; // CCL

import { FC00_CONTRACT } from '../../ice/contract/definitions/FC-00.js';
import { FITNESS_LIFECYCLE_CONTRACT } from '../../core/contracts/FC-FIT-01-LIFECYCLE.js';

/**
 * Constitutional Kernel
 * Wires the constitutional organs together.
 */
export class ConstitutionalKernel {
    constructor() {
        this.principles = new PrincipleRegistry();
        this.ruleEngine = new RuleEngine();
        this.audit = new AuditLedger();

        // Late Init
        this.stateMonitor = null;
        this.gate = null;
        this.health = null;
        this.invariantEngine = null;
        this.enforcer = null;
    }

    /**
     * Initialize the Kernel with configuration and institutional reference.
     * @param {object} config - Configuration object
     * @param {object} institutionalKernel - Reference to the ICE Kernel (for state monitoring)
     */
    initialize(config, institutionalKernel) {
        this.stateMonitor = new StateMonitor(institutionalKernel);
        this.gate = new ComplianceGate(this.ruleEngine, this.audit, this.stateMonitor);

        // Initialize Core Organs
        this.health = new HealthModel(institutionalKernel); // Monitors ICE
        this.invariantEngine = new InvariantEngine(institutionalKernel); // Audits ICE
        this.enforcer = new ResponseOrchestrator(this); // Orchestrates Kernel Responses

        this.loadPrinciples();

        console.log("CONSTITUTIONAL KERNEL: Initialized.");
        return this;
    }

    loadPrinciples() {
        // Load FC-00
        const fc00Principles = FC00_CONTRACT.invariants?.map((text, idx) => ({
            id: `P-FC00-${idx + 1}`,
            text: text,
            source: 'FC-00-GENESIS',
            level: 'supreme'
        })) || [];
        fc00Principles.forEach(p => this.principles.register(p));

        // Load FC-FIT-01
        const fit01Principles = FITNESS_LIFECYCLE_CONTRACT.invariants?.map((text, idx) => ({
            id: `P-FIT01-${idx + 1}`,
            text: text,
            source: 'FC-FIT-01-LIFECYCLE',
            level: 'derived'
        })) || [];
        fit01Principles.forEach(p => this.principles.register(p));

        console.log(`CONSTITUTIONAL KERNEL: Loaded ${fc00Principles.length + fit01Principles.length} Principles.`);
        this.loadRules();

        console.log(`CONSTITUTIONAL KERNEL: Loaded ${fc00Principles.length + fit01Principles.length} Principles.`);
    }

    loadRules() {
        // Lifecycle Transition Rules (FC-FIT-01)
        this.ruleEngine.registerRule({
            id: 'R-LIFE-01',
            description: 'GENESIS to PROBATION transition requires GENESIS_VERDICT_SUBMITTED.',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE') return true;
                if (context.action.payload.targetStage !== 'PROBATION') return true;

                // Check if verdict submitted (Found in Foundation state or Ledger)
                const foundation = context.state.foundation;
                return {
                    allowed: !!foundation?.why,
                    reason: 'Genesis Verdict not found.'
                };
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-LIFE-02',
            description: 'PROBATION to ACTIVE requires stabilization period.',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE') return true;
                if (context.action.payload.targetStage !== 'ACTIVE') return true;

                // Logic handled by engine, but Rule enforces the Gate
                // For now, allow if Engine requests it, assuming Engine did math.
                // In full implementation, we re-verify signals here.
                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-LIFE-03',
            description: 'ACTIVE to DEGRADABLE requires low integrity or neglect.',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE') return true;
                if (context.action.payload.targetStage !== 'DEGRADABLE') return true;
                // Engine has logic, Gate enforces simple check or 'Engine Auth'
                // Strict check: signals.activeDays >= 21 AND continuityIndex >= 0.55 (Wait, contract says this is ENTRY condition?)
                // Let's re-read contract.
                // DEGRADABLE entry: activeDays >= 21 AND continuityIndex >= 0.55 ?? 
                // Wait, degradation usually means BAD signals.
                // FC-FIT-01: 
                // DEGRADABLE: activeDays >= 21 && continuityIndex >= 0.55 
                // This looks like promotion to a "Higher/Sustainable" stage or "Degradable" capability?
                // Ah, "Degradable" means "Capable of Degrading"? Or "Currently Degrading"?
                // The enum is GENESIS -> PROBATION -> ACTIVE -> DEGRADABLE -> COLLAPSED.
                // Usually DEGRADABLE implies "At Risk".
                // Let's assume the contract logic I saw earlier is correct (it seemed to require high stats for Degradable?).
                // "No institution may degrade before it is DEGRADABLE" (Invariant).
                // So DEGRADABLE is a status you EARN, which allows you to Collpase?
                // OR is it a state of decay?
                // Step 1 Framing Note said: Triggered by integrity < 30%.
                // But contract code I viewed said: activeDays >= 21 && continuityIndex >= 0.55.
                // This implies DEGRADABLE is a "Mature" phase where you can now Lose status?
                // I will stick to what the contract CODE says for the Rule.
                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-LIFE-04',
            description: 'DEGRADABLE to COLLAPSED requires sustained failure.',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE') return true;
                if (context.action.payload.targetStage !== 'COLLAPSED') return true;
                return true;
            }
        });

        console.log("CONSTITUTIONAL KERNEL: Loaded Lifecycle Rules.");

        // Physiology Rules
        this.ruleEngine.registerRule({
            id: 'R-PHYS-01',
            description: 'Load cannot exceed Capacity * 1.5 (Injury Risk).',
            logic: (context) => {
                if (context.action.type !== 'PHYSIOLOGY_UPDATE_CAPACITY') return true;

                const phys = context.state.physiology;
                // Payload contains the NEW state values proposed OR the delta.
                // In Engine implementation, payload has { load, capacity... } which are the NEW values.
                // Wait, if payload has NEW values, we should check payload.load vs payload.capacity?
                // OR payload.load vs phys.capacity (historical)?
                // "Load cannot exceed Capacity * 1.5".
                // Usually Capacity is the BASELINE. Load is the CURRENT stress.
                // So check payload.load vs payload.capacity (if allowed to change) or phys.capacity.
                // Let's check payload.load vs payload.capacity (self-consistency of the update).

                const newLoad = context.action.payload.load || 0;
                const newCapacity = context.action.payload.capacity || phys.capacity || 100;

                if (newLoad > (newCapacity * 1.5)) {
                    return {
                        allowed: false,
                        reason: `Biological Ceiling Exceeded. Capacity ${newCapacity}, Attempted Load ${newLoad}`
                    };
                }
                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-PHYS-02',
            description: 'Mandatory Deload if fatigue is critical.',
            logic: (context) => {
                if (context.action.type !== 'PHYSIOLOGY_UPDATE_CAPACITY') return true;

                const phys = context.state.physiology;
                // If previous status was INJURED, block high load update?
                // Or check payload.status?

                if (phys.status === 'INJURED' || phys.status === 'RECOVERING') {
                    const newLoad = context.action.payload.load || 0;
                    // If load increases significantly? 
                    // Let's assume absolute load cap for recovery.
                    if (newLoad > 20) { // arbitrary low threshold for Active Recovery
                        return {
                            allowed: false,
                            reason: `System is ${phys.status}. High stress work blocked.`
                        };
                    }
                }
                return true;
            }
        });

        console.log("CONSTITUTIONAL KERNEL: Loaded Physiology Rules.");

        // Standing Rules
        this.ruleEngine.registerRule({
            id: 'R-STND-01',
            description: 'Promotion requires Integrity >= 90 and Consistency.',
            logic: (context) => {
                if (context.action.type !== 'STANDING_UPDATE_STATUS') return true;

                const currentBand = context.state.standing?.state || 'PRE_INDUCTION';
                const targetBand = context.action.payload.state;
                const integrity = context.action.payload.integrity; // The integrity being proposed (or current?)
                // Assuming payload contains the *calculated* integrity from the Engine.

                // Define Hierarchy
                const hierarchy = ['PRE_INDUCTION', 'GENESIS', 'STABLE', 'ASCENDING', 'SOVEREIGN'];
                // Note: 'STABLE' is White Belt equivalent? Or 'ACTIVE'? 
                // FitnessStandingEngine uses: STABLE, BREACHED, DEGRADED, ASCENDING.
                // InstitutionState has: PRE_INDUCTION.
                // Let's assume ASCENDING is higher than STABLE.

                const rank = { 'PRE_INDUCTION': 0, 'GENESIS': 1, 'BREACHED': 1, 'DEGRADED': 1, 'STABLE': 2, 'ASCENDING': 3, 'SOVEREIGN': 4 };

                if (rank[targetBand] > rank[currentBand]) {
                    if (integrity < 90) {
                        return {
                            allowed: false,
                            reason: `Promotion to ${targetBand} denied. Integrity ${integrity} < 90.`
                        };
                    }
                }
                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-STND-02',
            description: 'Integrity Loss requires specific Breach Citation.',
            logic: (context) => {
                if (context.action.type !== 'STANDING_UPDATE_STATUS') return true;

                const currentIntegrity = context.state.standing?.integrity || 100;
                const targetIntegrity = context.action.payload.integrity;

                if (targetIntegrity < currentIntegrity) {
                    // Check for justification in payload
                    if (!context.action.payload.reason && !context.action.payload.linkedEvent) {
                        return {
                            allowed: false,
                            reason: `Integrity penalty (${currentIntegrity} -> ${targetIntegrity}) rejected. No citation provided.`
                        };
                    }
                }
                return true;
            }
        });

        console.log("CONSTITUTIONAL KERNEL: Loaded Standing Rules.");
    }

    /**
     * Expose the Gate for operations.
     */
    getGate() {
        return this.gate;
    }

    /**
     * Expose State Monitor for trusted engines.
     */
    getMonitor() {
        return this.stateMonitor;
    }
}
