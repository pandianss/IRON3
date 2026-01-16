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
import { InstitutionalCycle } from './cycle/InstitutionalCycle.js';
import { PhaseController } from './governance/PhaseController.js';

// Compliance Framework
import { AuditLogger } from '../compliance/ael/AuditLogger.js';
import { EvidenceManager } from '../compliance/ael/EvidenceManager.js';
import { ComplianceTelemetryAgent } from '../compliance/mtl/ComplianceTelemetryAgent.js';
import { ConstitutionalTestHarness } from '../compliance/vvl/ConstitutionalTestHarness.js';
import { ResponseOrchestrator } from '../compliance/ccl/ResponseOrchestrator.js';

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
            fitnessStanding: new FitnessStandingEngine(this)
        };



        // Initialize Governance Modules
        this.phaseController = new PhaseController(this);

        // Initialize Cycle Controller
        this.cycle = new InstitutionalCycle(this);

        // Compliance Framework Initialization
        this.compliance = {
            ael: {
                logger: new AuditLogger(),
                evidence: new EvidenceManager()
            },
            // VVL & CCL depend on 'this', so we init them. 
            // MTL Agent auto-subscribes in its constructor.
            vvl: {
                harness: new ConstitutionalTestHarness(this)
            },
            ccl: {
                orchestrator: new ResponseOrchestrator(this)
            }
        };

        // MTL Agent (Observer)
        this.compliance.mtl = {
            agent: new ComplianceTelemetryAgent(this)
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
        // 0. AEL: Audit Log (Before processing)
        const auditHash = this.compliance.ael.logger.log({ type: eventType, payload, actorId });
        console.log(`ICE: Event Audit Logged [Hash: ${auditHash.substring(0, 8)}]`);

        // 1. Validate & Normalize (Event Registry)
        const event = EventRegistry.create(eventType, payload, actorId);

        // 2. Append to Memory (Ledger)
        this.ledger.append(event);
        console.log(`ICE: Event ${event.type} committed to Ledger [ID: ${event.id.substring(0, 8)}]`);

        // 3. Run Institutional Cycle (Evaluate Consequences)
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
            const verification = this.compliance.vvl.harness.verifySnapshot();

            if (verification.status === 'CONSTITUTIONAL_CRISIS') {
                console.error("ICE: CONSTITUTIONAL CRISIS DETECTED", verification.details);

                // CCL: Automated Response
                const response = await this.compliance.ccl.orchestrator.handleTrigger('CONSTITUTIONAL_CRISIS', verification);
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

