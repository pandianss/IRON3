import { PrincipleRegistry } from './principles/PrincipleRegistry.js';
import { RuleEngine } from './engine/RuleEngine.js';
import { InvariantEngine } from './engine/InvariantEngine.js';
import { AuditLedger } from './audit/AuditLedger.js';
import { InstitutionalStateMonitor } from './state/InstitutionalStateMonitor.js';
import { DegradationModel } from './state/DegradationModel.js';
import { ComplianceGate } from './gate/ComplianceGate.js';
import { ResponseOrchestrator } from './enforcement/ResponseOrchestrator.js';

// Imports removed (FC-00 and FC-FIT-01)// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

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
        this.stateMonitor = new InstitutionalStateMonitor(institutionalKernel, config.sovereignToken);
        this.gate = new ComplianceGate(this.ruleEngine, this.audit, this.stateMonitor);
        this.health = new DegradationModel(institutionalKernel);
        this.invariantEngine = new InvariantEngine(institutionalKernel);
        this.enforcer = new ResponseOrchestrator(this);

        this.loadPrinciples();
        console.log("CONSTITUTIONAL KERNEL: Initialized.");
        return this;
    }

    loadPrinciples() {
        // Core Governance Principles
        this.principles.register({ id: 'P-GEN-01', text: 'Constitutional Sovereignty', source: 'Constitution Article I', level: 'supreme' });
        this.principles.register({ id: 'P-ACT-01', text: 'Activation Health Requirement', threshold: 80 });
        this.principles.register({ id: 'P-DEG-01', text: 'Critical Degradation Threshold', threshold: 40 });

        console.log(`CONSTITUTIONAL KERNEL: Loaded ${this.principles.getAll().length} Principles.`);
        this.loadRules();
    }

    loadRules() {
        this.ruleEngine.registerRule({
            id: 'R-LIFE-01',
            logic: (context) => {
                if (context.action.type !== 'LIFECYCLE_PROMOTE' || context.action.payload.targetStage !== 'PROBATION') return true;
                return { allowed: !!context.state.foundation?.why, reason: 'Genesis Purpose (Why) not found.' };
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

        this.ruleEngine.registerRule({
            id: 'R-SESS-01',
            logic: (context) => {
                const current = context.state.session?.status || 'IDLE';
                const target = context.action.payload.status;
                const valid = {
                    'IDLE': ['PENDING', 'ACTIVE'],
                    'PENDING': ['ACTIVE', 'IDLE'],
                    'ACTIVE': ['INTERRUPTED', 'IDLE'],
                    'INTERRUPTED': ['ACTIVE', 'IDLE'],
                    'COOLDOWN': ['IDLE']
                };
                return valid[current]?.includes(target) || { allowed: false, reason: `Illegal transition ${current}->${target}` };
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-SYS-01',
            description: 'Actor Provenance Verification',
            logic: (context) => {
                const validActors = new Set([
                    'InstitutionalKernel', 'SovereignKernel', 'AuthorityEngine', 'MandateEngine', 'SessionEngine',
                    'StandingEngine', 'OVERRIDE_ADMIN', 'SimulationHarness', 'System'
                ]);
                if (validActors.has(context.action.actor)) return true;
                return { allowed: false, reason: `Unrecognized Actor: ${context.action.actor}` };
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

        this.ruleEngine.registerRule({
            id: 'R-STND-01',
            description: 'Integrity Bounds',
            logic: (context) => {
                const { integrity } = context.action.payload;
                if (integrity < 0 || integrity > 100) return { allowed: false, reason: 'Integrity must be between 0 and 100.' };
                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-STND-02',
            description: 'Monotonicity Law',
            logic: (context) => {
                if (context.state.lifecycle?.stage === 'GENESIS') return true;
                if (context.action.payload.integrity < (context.state.standing?.integrity || 0) - 10) {
                    if (!context.action.payload.evidence) return { allowed: false, reason: 'Major integrity drop requires evidence.' };
                }
                return true;
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-AUTH-01',
            description: 'Interaction Level Adherence',
            logic: (context) => {
                const level = context.action.payload.interactionLevel;
                const allowed = ['OBSERVATIONAL', 'RESTRICTED', 'CALIBRATION', 'FULL', 'GOD_MODE'];
                return allowed.includes(level) || { allowed: false, reason: `Invalid interaction level: ${level}` };
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-MAND-01',
            description: 'Mandate Tone Consistency',
            logic: (context) => {
                const { tone } = context.action.payload.narrative || {};
                const validTones = ['GUIDANCE', 'WARNING', 'CRITICAL', 'AUTHORITY', 'SYSTEM'];
                return validTones.includes(tone) ? true : { allowed: false, reason: `Unknown mandate tone: ${tone}` };
            }
        });

        console.log("CONSTITUTIONAL KERNEL: Sovereign Rules Ratified.");
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
            principles: this.principles.getAll(),
            audit: this.audit.getLog(),
            health: this.health.getScore(),
            invariants: this.invariantEngine.getAuditLog()
        };
    }

    getGate() { return this.gate; }
    getMonitor() { return this.stateMonitor; }
}
