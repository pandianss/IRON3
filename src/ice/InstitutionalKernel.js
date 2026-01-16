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

import { ConstitutionalKernel } from '../compliance/kernel/index.js';

export class InstitutionalKernel {
    constructor(config = {}) {
        this.scenario = config.scenario || {};
        this.subscribers = new Set();
        this.ledger = new MemoryLedger(config.initialEvents || []);

        // Sovereignty Token: The only key to write access
        const sovereignToken = Symbol('SOVEREIGN_WRITE_ACCESS');
        this.state = new InstitutionState(sovereignToken);

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

        this.phaseController = new PhaseController(this);
        this.cycle = new InstitutionalCycle(this);

        // Pass token strictly to Constitutional Kernel
        this.complianceKernel = new ConstitutionalKernel().initialize(
            { ...config, sovereignToken },
            this
        );

        this.compliance = {
            audit: {
                logger: {
                    log: (event) => {
                        return this.complianceKernel.audit.recordTransition({ ...event, type: event.type, note: 'Generic Log' });
                    }
                }
            }
        };

        console.log("ICE: Kernel Initialized (v1.0 Sovereignty).");
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notify() {
        if (!this.subscribers) return;
        const snapshot = this.getSnapshot();
        this.subscribers.forEach(cb => cb(snapshot));
    }

    async ingest(eventType, payload, actorId) {
        const action = { type: 'INGEST_EVENT', payload: { eventType, payload }, actor: actorId, rules: [] };
        return this.complianceKernel.getGate().govern(action, async () => {
            const event = EventRegistry.create(eventType, payload, actorId);
            this.ledger.append(event);
            console.log(`ICE: Event ${event.type} committed to Ledger [ID: ${event.id.substring(0, 8)}]`);
            return this.evaluate();
        });
    }

    async evaluate() {
        try {
            const result = await this.cycle.run();
            this.state.update('error', null);
            console.log("ICE: Cycle Success. Authority Maintained.");
            this.complianceKernel.evaluate();
        } catch (e) {
            console.error("ICE: Cycle Failure", e);
            this.state.update('error', e.message);
        }
    }

    getSnapshot() {
        const history = this.ledger.getHistory();
        const activeModules = history
            .filter(e => e.type === 'MODULE_ACTIVATED')
            .map(e => e.payload.moduleId);

        return {
            history,
            activeModules,
            phase: this.state.getDomain('phase'),
            state: this.state.getSnapshot(),
            mandates: this.state.getDomain('mandates') || { narrative: { tone: 'GUIDANCE', message: 'SYSTEM OFFLINE' }, motion: {}, surfaces: [] },
            compliance: {
                audit: this.complianceKernel.audit.getLog()
            }
        };
    }

    setState(domain, data) {
        this.complianceKernel.getMonitor().applyEvent(domain, data);
    }
}
