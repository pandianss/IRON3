import { PrincipleRegistry } from './principles/PrincipleRegistry.js';
import { RuleEngine } from './engine/RuleEngine.js';
import { InvariantEngine } from './engine/InvariantEngine.js';
import { AuditLedger } from './audit/AuditLedger.js';
import { InstitutionalStateMonitor } from './state/InstitutionalStateMonitor.js';
import { HealthModel } from './state/HealthModel.js';
import { ComplianceGate } from './gate/ComplianceGate.js';
import { ResponseOrchestrator } from './enforcement/ResponseOrchestrator.js';

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

        this.stateMonitor = null;
        this.gate = null;
        this.health = null;
        this.invariantEngine = null;
        this.enforcer = null;
    }

    initialize(config, institutionalKernel) {
        this.stateMonitor = new InstitutionalStateMonitor(institutionalKernel);
        this.gate = new ComplianceGate(this.ruleEngine, this.audit, this.stateMonitor);
        this.health = new HealthModel(institutionalKernel);
        this.invariantEngine = new InvariantEngine(institutionalKernel);
        this.enforcer = new ResponseOrchestrator(this);

        this.loadPrinciples();
        console.log("CONSTITUTIONAL KERNEL: Initialized.");
        return this;
    }

    loadPrinciples() {
        const fc00Principles = FC00_CONTRACT.invariants?.map((text, idx) => ({
            id: `P-FC00-${idx + 1}`,
            text: text,
            source: 'FC-00-GENESIS',
            level: 'supreme'
        })) || [];
        fc00Principles.forEach(p => this.principles.register(p));

        const fit01Principles = FITNESS_LIFECYCLE_CONTRACT.invariants?.map((text, idx) => ({
            id: `P-FIT01-${idx + 1}`,
            text: text,
            source: 'FC-FIT-01-LIFECYCLE',
            level: 'derived'
        })) || [];
        fit01Principles.forEach(p => this.principles.register(p));

        console.log(`CONSTITUTIONAL KERNEL: Loaded ${fc00Principles.length + fit01Principles.length} Principles.`);
        this.loadRules();
    }

    loadRules() {
        // --- Lifecycle Rules ---
        this.ruleEngine.registerRule({
            id: 'R-LIFE-01',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE' || context.action.payload.targetStage !== 'PROBATION') return true;
                return { allowed: !!context.state.foundation?.why, reason: 'Genesis Verdict not found.' };
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-LIFE-04',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE' || context.action.payload.targetStage !== 'COLLAPSED') return true;
                const evidence = context.action.payload.evidence || {};
                if (context.state.lifecycle?.stage !== 'DEGRADABLE') return { allowed: false, reason: 'Must be DEGRADABLE to collapse.' };
                if ((evidence.degradedDays || 0) < 30) return { allowed: false, reason: 'Collapse requires 30 days of degradation.' };
                return true;
            }
        });

        // --- Authority/Mandate/Session Rules ---
        this.ruleEngine.registerRule({
            id: 'R-AUTH-01',
            logic: (context) => true // Placeholder logic
        });

        this.ruleEngine.registerRule({
            id: 'R-MAND-01',
            logic: (context) => true // Placeholder logic
        });

        this.ruleEngine.registerRule({
            id: 'R-SESS-01',
            logic: (context) => {
                const current = context.state.session?.status || 'INACTIVE';
                const target = context.action.payload.status;
                const valid = { 'INACTIVE': ['ACTIVE'], 'ACTIVE': ['COOLDOWN', 'INACTIVE'], 'COOLDOWN': ['INACTIVE'] };
                return valid[current]?.includes(target) || { allowed: false, reason: `Illegal transition ${current}->${target}` };
            }
        });

        // --- System Hardening Rules ---
        this.ruleEngine.registerRule({
            id: 'R-SYS-01',
            description: 'Actor Provenance Verification',
            logic: (context) => {
                const validActors = ['InstitutionalKernel', 'AuthorityEngine', 'MandateEngine', 'SessionEngine', 'PhysiologicalEngine', 'FitnessStandingEngine', 'FitnessLifecycleEngine', 'OVERRIDE_ADMIN'];
                return validActors.includes(context.action.actor) || { allowed: false, reason: `Unrecognized Actor: ${context.action.actor}` };
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-SYS-02',
            description: 'Emergency Override',
            logic: (context) => {
                if (context.action.actor === 'OVERRIDE_ADMIN' && context.action.payload.overrideToken === 'SOVEREIGN_RECOVERY') {
                    return { allowed: true, forceAllow: true };
                }
                return true;
            }
        });

        console.log("CONSTITUTIONAL KERNEL: All Rules Ratified.");
    }

    evaluate() {
        const report = this.invariantEngine.verifySnapshot();
        if (report.status === 'CONSTITUTIONAL_CRISIS') {
            this.enforcer.handleTrigger('CONSTITUTIONAL_CRISIS', report);
        }
        return report;
    }

    getSnapshot() {
        return {
            principles: this.principles.history,
            audit: this.audit.getLog(),
            health: this.health.getScore(),
            invariants: this.invariantEngine.getAuditLog()
        };
    }

    getGate() { return this.gate; }
    getMonitor() { return this.stateMonitor; }
}
