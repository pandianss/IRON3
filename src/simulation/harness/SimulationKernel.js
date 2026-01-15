import { InstitutionalInterface } from './InstitutionalInterface.js';
import { InstitutionalRecorder } from './InstitutionalRecorder.js';
import { BehaviorGenerator } from './BehaviorGenerators.js';
import { InvariantEngine } from './InvariantEngine.js';

/**
 * Harness Module: Simulation Kernel
 * Role: Sovereign Controller of Simulations.
 * Owns time, events, and lifecycle.
 */
export class SimulationKernel {
    constructor() {
        this.interface = new InstitutionalInterface();
        this.recorder = new InstitutionalRecorder();
        this.invariants = new InvariantEngine();
        this.generator = new BehaviorGenerator();
        this.clock = 0; // Ticks
    }

    /**
     * Runs a declarative scripted scenario.
     * @param {object} scenario - Spec for the run
     */
    async run(scenario) {
        console.log(`HARNESS: Starting Scripted Scenario - ${scenario.id}`);
        this.clock = 0;

        for (const step of scenario.timeline) {
            console.log(`HARNESS: T=${step.tick} | Executing: ${step.event}`);

            const result = await this.interface.inject({
                type: step.event,
                payload: step.payload,
                actorId: step.actor
            });

            const snapshot = this.interface.getSnapshot();
            this.recorder.capture(step.tick, step.event, snapshot);
            this.invariants.check(step.tick, snapshot);
        }

        return this.seal();
    }

    /**
     * Runs a generative simulation for N days.
     * @param {object} config - { days, actors: [{id, archetype}] }
     */
    async runGenerative(config) {
        console.log(`HARNESS: Starting Generative Run - ${config.days} Days`);
        this.clock = 0;

        // Initialize State for Actors (Local Simulation State)
        const actors = config.actors.map(a => ({
            ...a,
            state: { standing: { state: 'PRE_INDUCTION' } } // Mock initial view
        }));

        for (let day = 1; day <= config.days; day++) {
            // console.log(`HARNESS: Day ${day}`);
            for (const actor of actors) {
                // 1. Decide
                const eventType = this.generator.decide(actor, { obligations: [] });

                if (eventType) {
                    // 2. Act
                    // console.log(`  -> Actor ${actor.id} emits ${eventType}`);
                    await this.interface.inject({
                        type: eventType,
                        payload: {},
                        actorId: actor.id
                    });

                    // 3. Update Local View (for decision making next turn)
                    const snapshot = this.interface.getSnapshot();
                    actor.state = snapshot.state; // Ideally filtered by actor

                    this.recorder.capture(day, eventType, snapshot);
                    this.invariants.check(day, snapshot);
                }
            }
        }

        return this.seal();
    }

    seal() {
        const artifact = this.recorder.exportArtifact();
        const report = this.invariants.getReport();
        console.log(`HARNESS: Run Complete. Invariants Passed: ${report.passed}`);
        return { artifact, report };
    }
}
