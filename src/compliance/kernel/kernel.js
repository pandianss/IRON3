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
            description: 'PROBATION to ACTIVE requires evidence of sustained continuity.',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE') return true;
                if (context.action.payload.targetStage !== 'ACTIVE') return true;

                const evidence = context.action.payload.evidence || {};
                // Article III.4: "Sustained positive continuity"
                // We check if the Engine provided evidence of activity.
                // Minimal check: activeDays > 0 and continuityIndex > 0

                if (!evidence.activeDays || evidence.activeDays < 3) { // Min 3 days to be "Sustained" locally?
                    // Contract likely demands more, but Constitution demands "Demonstrated".
                    return {
                        allowed: false,
                        reason: `Promotion to ACTIVE denied. Insufficient continuity evidence (Active Days: ${evidence.activeDays}).`
                    };
                }
                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-LIFE-03',
            description: 'ACTIVE to DEGRADABLE requires maturity (Article III.5).',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE') return true;
                if (context.action.payload.targetStage !== 'DEGRADABLE') return true;

                // Article III.5: "DEGRADABLE begins only after prolonged ACTIVE standing."
                const evidence = context.action.payload.evidence || {};

                // We ensure we aren't rushing into Degradable mode unnecessarily, or that we ARE mature enough.
                if (evidence.activeDays < 14) { // "Prolonged" implies time.
                    return {
                        allowed: false,
                        reason: `Institution is too young to be DEGRADABLE. (Active Days: ${evidence.activeDays} < 14).`
                    };
                }
                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-LIFE-04',
            description: 'DEGRADABLE to COLLAPSED requires sustained failure (Article VII).',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE') return true;
                if (context.action.payload.targetStage !== 'COLLAPSED') return true;

                const evidence = context.action.payload.evidence || {};
                const currentStage = context.state.lifecycle?.stage;

                // 1. Must be DEGRADABLE (Article VII.1)
                if (currentStage !== 'DEGRADABLE') {
                    return {
                        allowed: false,
                        reason: `Collapse Blocked. Lifecycle is ${currentStage}, must be DEGRADABLE.`
                    };
                }

                // 2. Duration Check (30 Days)
                if ((evidence.degradedDays || 0) < 30) {
                    return {
                        allowed: false,
                        reason: `Collapse Blocked. Degradation duration ${evidence.degradedDays} < 30 days.`
                    };
                }

                // 3. Continuity Check (Abandonment)
                if ((evidence.continuityIndex || 0) >= 0.2) {
                    return {
                        allowed: false,
                        reason: `Collapse Blocked. Continuity ${evidence.continuityIndex} > 0.2 (Still Alive).`
                    };
                }

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

        this.ruleEngine.registerRule({
            id: 'R-STND-03',
            description: 'Degradation requires DEGRADABLE status and Convergent Evidence (FC-FIT-02).',
            logic: (context) => {
                if (context.action.type !== 'STANDING_UPDATE_STATUS') return true;
                const targetState = context.action.payload.state;

                // Only govern transitions TO 'DEGRADED' (or 'BREACHED' if that's the engine's term for it)
                // Assuming 'DEGRADED' is the state.
                if (targetState !== 'DEGRADED') return true;

                // 1. Lifecycle Precondition (Article II.1)
                const lifecycle = context.state.lifecycle?.stage;
                if (lifecycle !== 'DEGRADABLE') {
                    return {
                        allowed: false,
                        reason: `Degradation blocked. Lifecycle is ${lifecycle}, must be DEGRADABLE.`
                    };
                }

                // 2. Convergent Evidence (Article III)
                const evidence = context.action.payload.evidence || {};
                let validVectors = 0;
                const vectors = ['continuityBreach', 'stressDominance', 'standingLoss', 'integrityFailure', 'adjudicativeConfirmation'];

                vectors.forEach(v => {
                    if (evidence[v] && evidence[v].detected) validVectors++;
                });

                if (validVectors < 2) {
                    return {
                        allowed: false,
                        reason: `Degradation blocked. Insufficient Evidence (${validVectors}/2 vectors). (Article III).`
                    };
                }

                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-STND-04',
            description: 'Recovery must follow governed phases (No instant reinstatement).',
            logic: (context) => {
                if (context.action.type !== 'STANDING_UPDATE_STATUS') return true;

                const currentState = context.state.standing?.state;
                const targetState = context.action.payload.state; // Proposed state
                const recoveryPhase = context.action.payload.recoveryPhase; // If in recovery

                // 1. Block Illegal Exit from DEGRADED
                if (currentState === 'DEGRADED' || currentState === 'BREACHED') {
                    // Attempting to jump to STABLE/ASCENDING without finishing Recovery
                    if (targetState === 'STABLE' || targetState === 'ASCENDING' || targetState === 'SOVEREIGN') {
                        // Check if Revalidation is complete (Article VI.3)
                        if (recoveryPhase !== 'COMPLETED') {
                            return {
                                allowed: false,
                                reason: `Premature reinstatement blocked. Recovery Phase is '${recoveryPhase || 'NONE'}', must be 'COMPLETED'.`
                            };
                        }
                    }
                }

                // 2. Enforce Phase Sequence (Optional but good for strictness)
                // STABILIZATION -> RECONSTITUTION -> REINTEGRATION -> REVALIDATION

                return true;
            }
        });

        console.log("CONSTITUTIONAL KERNEL: Loaded Standing Rules.");

        // Authority Rules
        this.ruleEngine.registerRule({
            id: 'R-AUTH-01',
            description: 'Authority must align with institutional Phase and Standing.',
            logic: (context) => {
                if (context.action.type !== 'AUTHORITY_UPDATE_PROFILE') return true;

                const standing = context.state.standing?.state || 'PRE_INDUCTION';
                const profile = context.action.payload;

                // 1. Violation Lockout (Article III)
                if (standing === 'BREACHED' || standing === 'DEGRADED') {
                    if (profile.interactionLevel !== 'MINIMAL' && profile.interactionLevel !== 'OBSERVATIONAL') {
                        // In v1.0, we allow 'OBSERVATIONAL' during degradation.
                        // If the engine tries to open 'FULL' access while degraded, block it.
                        const hasLocks = profile.locks?.length > 0;
                        if (!hasLocks) {
                            return {
                                allowed: false,
                                reason: `Authority Breach: Institution is ${standing}. Safety locks mandatory.`
                            };
                        }
                    }
                }
                return true;
            }
        });

        // Mandate Rules
        this.ruleEngine.registerRule({
            id: 'R-MAND-01',
            description: 'Mandates must remain within logical bounds of Standing.',
            logic: (context) => {
                if (context.action.type !== 'MANDATE_UPDATE_BUNDLE') return true;

                const standing = context.state.standing?.state || 'STABLE';
                const bundle = context.action.payload;

                // 1. Narrative Consistency
                if (standing === 'BREACHED' && bundle.narrative?.tone !== 'ALARM' && bundle.narrative?.tone !== 'WARNING') {
                    return {
                        allowed: false,
                        reason: `Mandate Breach: Institution is BREACHED. UI Tone must be ALARM or WARNING.`
                    };
                }

                return true;
            }
        });

        // Session Rules
        this.ruleEngine.registerRule({
            id: 'R-SESS-01',
            description: 'Session transitions must be structurally valid.',
            logic: (context) => {
                if (context.action.type !== 'SESSION_UPDATE_STATUS') return true;

                const currentStatus = context.state.session?.status || 'IDLE';
                const targetStatus = context.action.payload.status;

                // Simple State Machine Validation
                const validTransitions = {
                    'IDLE': ['PENDING', 'ACTIVE'], // Direct to Active allowed for shortcuts
                    'PENDING': ['ACTIVE', 'IDLE'],
                    'ACTIVE': ['IDLE']
                };

                if (!validTransitions[currentStatus].includes(targetStatus)) {
                    return {
                        allowed: false,
                        reason: `Session Breach: Illegal transition ${currentStatus} -> ${targetStatus}.`
                    };
                }

                return true;
            }
        });

        console.log("CONSTITUTIONAL KERNEL: Loaded Authority, Mandate, and Session Rules.");
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
