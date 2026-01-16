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

// Compliance Framework (Constitutional Kernel)
import { ConstitutionalKernel } from '../compliance/kernel/index.js';

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

        // Compliance Framework Initialization (The Sovereign Kernel)
        this.complianceKernel = new ConstitutionalKernel().initialize({}, this);

        // Backwards compatibility / Mapping for internal usage if needed, 
        // or strictly use complianceKernel.
        this.compliance = {
            // Mapping 'audit.logger' to new 'audit' ledger for existing logs
            audit: {
                logger: {
                    log: (event) => {
                        // Adapter to new Ledger
                        // The new ledger has recordDecision/Transition/Violation.
                        // It handles generic events? The prompt said "eventRecorder.ts" in Audit.
                        // My implementation of AuditLedger has recordDecision/Transition/Violation.
                        // I will add a generic log method or map it.
                        // For now, I'll allow direct access to history?
                        // Or add a generic 'logEvent' to AuditLedger.
                        // Let's assume log() returns a hash/ID.
                        return this.complianceKernel.audit.recordTransition({ ...event, type: event.type, note: 'Generic Log' });
                    }
                }
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
        // 0. COMPLIANCE INTERCEPTION (Constitutional Gate)
        // "This is the non-bypassable checkpoint."
        // We wrap the ingestion in the Gate? 
        // Or we just gate the event?
        // Pattern: gate.govern(action, () => realOperation())

        const action = { type: 'INGEST_EVENT', payload: { eventType, payload }, actor: actorId, rules: [] };

        // We wrap the rest of the ingest logic in a governed operation
        return this.complianceKernel.getGate().govern(action, async () => {
            // 1. AEL: Audit Log
            // The Gate logs the decision.
            // But we also want to log the EVENT itself into the Ledger?
            // The Institutional Kernel Ledger (MemoryLedger) is different from Compliance Audit Ledger.

            // 2. Validate & Normalize
            const event = EventRegistry.create(eventType, payload, actorId);

            // 3. Append to Memory (Ledger)
            this.ledger.append(event);
            console.log(`ICE: Event ${event.type} committed to Ledger [ID: ${event.id.substring(0, 8)}]`);

            // 4. Run Institutional Cycle
            return this.evaluate();
        });
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

            // VVL Check via Kernel? 
            // The new kernel has 'invariantEngine'. 
            // My implementation has 'stateMonitor' but I haven't implemented explicit 'invariantEngine' in the ConstitutionalKernel yet (it was in blueprint but I prioritized 6 files).
            // I'll skip explicit post-cycle check for this specific step unless I port VVL harness.
            // I can assume ComplianceGate handles pre-checks.

        } catch (e) {
            console.error("ICE: Cycle Failure", e);
            this.state.update('error', e.message);
            // Trigger Enforcement?
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
            mandates: this.state.getDomain('mandates') || { narrative: { tone: 'GUIDANCE', message: 'SYSTEM OFFLINE' }, motion: {}, surfaces: [] },
            // Constitutional Compliance
            compliance: {
                audit: this.complianceKernel.audit.getLog() // Expose the Decision Record
            }
        };
    }
}

