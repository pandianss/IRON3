import { EventRegistry } from './EventRegistry.js';
import { MemoryLedger } from './MemoryLedger.js';
import { InstitutionState } from './InstitutionState.js';
import { ContractEngine } from './engines/ContractEngine.js';
import { StandingEngine } from './engines/StandingEngine.js';
import { AuthorityEngine } from './engines/AuthorityEngine.js';
import { MandateEngine } from './engines/MandateEngine.js';
import { SessionEngine } from './engines/SessionEngine.js';
import { PhysiologicalEngine } from './engines/fitness/PhysiologicalEngine.js';
import { InstitutionalCycle } from './cycle/InstitutionalCycle.js';

/**
 * ICE Module 1: Institutional Kernel
 * Role: Sovereign Coordinator.
 * The only entry point to the Core Engine.
 */
export class InstitutionalKernel {
    constructor(config = {}) {
        this.ledger = new MemoryLedger(config.initialEvents || []);
        this.state = new InstitutionState();
        this.state.physiology = { capacity: 100, load: 0, status: 'OPTIMAL', law: { isAuthorized: true, mandates: [] } };

        // Initialize Engines with reference to Kernel
        this.engines = {
            contract: new ContractEngine(this),
            standing: new StandingEngine(this),
            authority: new AuthorityEngine(this),
            mandate: new MandateEngine(this),
            session: new SessionEngine(this),
            physiology: new PhysiologicalEngine(this)
        };


        // Initialize Cycle Controller
        this.cycle = new InstitutionalCycle(this);

        // React Bridge Support (Observer)
        this.subscribers = new Set();

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
    evaluate() {
        const result = this.cycle.run();
        this.notify();
        return result;
    }

    /**
     * Diagnostic Access
     */
    getSnapshot() {
        return {
            history: this.ledger.getHistory(),
            state: this.state.getSnapshot(),
            mandates: this.state.getDomain('mandates') || { narrative: { tone: 'GUIDANCE', message: 'SYSTEM OFFLINE' }, motion: {}, surfaces: [] }
        };
    }
}
