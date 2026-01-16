import { PrincipleRegistry } from './principles/PrincipleRegistry.js';
import { RuleEngine } from './engine/RuleEngine.js';
import { InvariantEngine } from './engine/InvariantEngine.js';
import { AuditLedger } from './audit/AuditLedger.js';
import { InstitutionalStateMonitor } from './state/InstitutionalStateMonitor.js';
import { DegradationModel } from './state/DegradationModel.js';
import { ComplianceGate } from './gate/ComplianceGate.js';
import { ResponseOrchestrator } from './enforcement/ResponseOrchestrator.js';

import { FC00_CONTRACT } from '../../ice/contract/definitions/FC-00.js';
import { FITNESS_LIFECYCLE_CONTRACT } from '../../core/contracts/FC-FIT-01-LIFECYCLE.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

        try {
            const principlesPath = path.resolve(__dirname, 'principles', 'texts', 'activation.principles.yaml');
            if (fs.existsSync(principlesPath)) {
                this.principles.loadFromYaml(fs.readFileSync(principlesPath, 'utf8'));
            } else {
                this.principles.register({ id: 'P-ACT-01', text: 'Activation Health Requirement', threshold: 80 });
                this.principles.register({ id: 'P-DEG-01', text: 'Critical Degradation Threshold', threshold: 40 });
            }
        } catch (e) {
            console.error("KERNEL: Failed to register Slice Principles", e);
        }

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
                const current = context.state.session?.status || 'INACTIVE';
                const target = context.action.payload.status;
                const valid = { 'INACTIVE': ['ACTIVE'], 'ACTIVE': ['COOLDOWN', 'INACTIVE'], 'COOLDOWN': ['INACTIVE'] };
                return valid[current]?.includes(target) || { allowed: false, reason: `Illegal transition ${current}->${target}` };
            }
        });

        this.ruleEngine.registerRule({
            id: 'R-SYS-01',
            description: 'Actor Provenance Verification',
            logic: (context) => {
                const validActors = new Set([
                    'InstitutionalKernel', 'AuthorityEngine', 'MandateEngine', 'SessionEngine',
                    'PhysiologicalEngine', 'FitnessStandingEngine', 'FitnessLifecycleEngine',
                    'OVERRIDE_ADMIN', 'SimulationHarness', 'System'
                ]);
                if (context.action.actor === 'SimulationHarness') {
                    console.log("DEBUG: R-SYS-01 Set has SimulationHarness:", validActors.has('SimulationHarness'));
                    console.log("DEBUG: R-SYS-01 Set values:", Array.from(validActors));
                }
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
            principles: this.principles.getAll(),
            audit: this.audit.getLog(),
            health: this.health.getScore(),
            invariants: this.invariantEngine.getAuditLog()
        };
    }

    getGate() { return this.gate; }
    getMonitor() { return this.stateMonitor; }
}
