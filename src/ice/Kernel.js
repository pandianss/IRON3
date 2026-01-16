import { EventRegistry } from './EventRegistry.js';
import { MemoryLedger } from './MemoryLedger.js';
import { InstitutionState } from './InstitutionState.js';
import { ContractEngine } from './engines/ContractEngine.js';
import { StandingEngine } from './engines/StandingEngine.js';
import { AuthorityEngine } from './engines/AuthorityEngine.js';
import { MandateEngine } from './engines/MandateEngine.js';
import { SessionEngine } from './engines/SessionEngine.js';
import { PhysiologicalEngine } from './engines/fitness/PhysiologicalEngine.js';
import { FitnessStandingEngine } from './engines/fitness/FitnessStandingEngine.js';
import { FitnessLifecycleEngine } from '../institution/logic/lifecycle/FitnessLifecycleEngine.js';
import { InstitutionalCycle } from './cycle/InstitutionalCycle.js';
import { PhaseController } from './governance/PhaseController.js';

// Compliance Framework (Unified Root)
import {
    AuditLogger,
    EvidenceManager,
    ComplianceTelemetryAgent,
    ConstitutionalTestHarness,
    ResponseOrchestrator,
    PrincipleRegistry,
    RuleEngine,
    DecisionInterceptor
} from '../compliance/index.js';

/**
 * ICE Module 1: Institutional Kernel
 * Role: Sovereign Coordinator.
 * The only entry point to the Core Engine.
 */
export class InstitutionalKernel {
    constructor(config = {}) {
        this.scenario = config.scenario || {};
        // React Bridge Support (Observer) - Init first for Compliance Modules
        this.subscribers = new Set();

        this.ledger = new MemoryLedger(config.initialEvents || []);
        this.state = new InstitutionState();

        // Initialize Engines with reference to Kernel
        this.engines = {
            contract: new ContractEngine(this),
            standing: new StandingEngine(this),
            authority: new AuthorityEngine(this),
            mandate: new MandateEngine(this),
            session: new SessionEngine(this),
            physiology: new PhysiologicalEngine(this),
            fitnessStanding: new FitnessStandingEngine(this),
            fitnessLifecycle: new FitnessLifecycleEngine(this)
        };



        // Initialize Governance Modules
        this.phaseController = new PhaseController(this);

        // Initialize Cycle Controller
        this.cycle = new InstitutionalCycle(this);

        // Compliance Framework Initialization
        // "One new root... No simulation... occurs without passing through it."
        this.compliance = {
            audit: {
                logger: new AuditLogger(),
                evidence: new EvidenceManager()
            },
            tests: {
                harness: new ConstitutionalTestHarness(this)
            },
            enforcement: {
                orchestrator: new ResponseOrchestrator(this)
            },
            metrics: {
                agent: new ComplianceTelemetryAgent(this)
            },
            principles: PrincipleRegistry,
            engine: {
                rules: RuleEngine,
                interceptor: DecisionInterceptor
            }
        };


        console.log("ICE: Kernel Initialized (v1.0 Sovereignty).");
    }

    /**
     * Subscribe to Kernel updates (Post-Cycle).
     * @param {function} callback
     * @returns {function} unsubscribe
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notify() {
        if (!this.subscribers) return;
        const snapshot = this.getSnapshot();
        this.subscribers.forEach(cb => cb(snapshot));
    }

    /**
     * The Single Entry Point.
     * Ingests a signal, normalizes it, and runs the cycle.
     * @param {string} eventType
     * @param {object} payload
     * @param {string} actorId
     */
    async ingest(eventType, payload, actorId) {
        // 0. COMPLIANCE INTERCEPTION (Policy Execution Layer)
        // No event enters the Ledger without permission.
        const decision = this.compliance.engine.interceptor.intercept('INGEST_EVENT', { eventType, payload, actorId }, []);
        // Note: We can register global rules to check here, e.g. 'R-GLOBAL-INGEST'.

        if (!decision.allowed) {
            console.error(`ICE: Ingest Blocked by Compliance: ${decision.rejectionReasons.join(', ')}`);
            throw new Error(`Compliance Violation: ${decision.rejectionReasons.join(', ')}`);
        }

        // 1. AEL: Audit Log (Before processing)
        const auditHash = this.compliance.audit.logger.log({ type: eventType, payload, actorId });
        console.log(`ICE: Event Audit Logged [Hash: ${auditHash.substring(0, 8)}]`);

        // 2. Validate & Normalize (Event Registry)
        const event = EventRegistry.create(eventType, payload, actorId);

        // 3. Append to Memory (Ledger)
        this.ledger.append(event);
        console.log(`ICE: Event ${event.type} committed to Ledger [ID: ${event.id.substring(0, 8)}]`);

        // 4. Run Institutional Cycle (Evaluate Consequences)
        return this.evaluate();
    }

    /**
     * Orchestrates the evaluation of the institution based on new memory.
     * This is the "Cycle".
     */
    async evaluate() {
        try {
            const result = await this.cycle.run();
            // Clear any lingering errors on success
            this.state.update('error', null);
            console.log("ICE: Cycle Success. Authority Maintained.");

            // VVL: Invariant Check (Post-Cycle Verification)
            const verification = this.compliance.tests.harness.verifySnapshot();

            if (verification.status === 'CONSTITUTIONAL_CRISIS') {
                console.error("ICE: CONSTITUTIONAL CRISIS DETECTED", verification.details);

                // CCL: Automated Response
                const response = await this.compliance.enforcement.orchestrator.handleTrigger('CONSTITUTIONAL_CRISIS', verification);
                if (response?.action === 'LOCKED') {
                    console.warn("ICE: SYSTEM LOCKDOWN EFFECTIVE IMMEDIATELY.");
                    // In a full implementation, we would set a flag in State to block further mutations.
                }
            }

            this.notify();
            return result;
        } catch (error) {
            console.error("ICE: Kernel Evaluation Failed", error);
            this.state.update('error', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            this.notify();
            throw error;
        }
    }

    /**
     * Diagnostic Access
     */
    getSnapshot() {
        const history = this.ledger.getHistory();
        const activeModules = history
            .filter(e => e.type === 'MODULE_ACTIVATED')
            .map(e => e.payload.moduleId);

        return {
            history,
            activeModules, // Tracking active discipline modules
            phase: this.state.getDomain('phase'),
            state: this.state.getSnapshot(),
            mandates: this.state.getDomain('mandates') || { narrative: { tone: 'GUIDANCE', message: 'SYSTEM OFFLINE' }, motion: {}, surfaces: [] }
        };
    }
}

