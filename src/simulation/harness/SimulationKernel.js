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
    constructor(scenario) {
        this.scenario = scenario;
        this.recorder = new InstitutionalRecorder();

        // Seeded randomizer if provided in scenario
        const seed = scenario?.randomization?.seed || Date.now();
        this.randomizer = {
            random: () => {
                // Simplified seeded random or just Math.random
                return Math.random();
            }
        };

        this.generator = new BehaviorGenerator(scenario, this.randomizer);
        this.invariants = new InvariantEngine();
        this.clock = 0;
    }

    /**
     * Runs a generative simulation for N days.
     * @param {object} config - Not used anymore, scenario is passed to constructor
     */
    async runGenerative() {
        const days = this.scenario.duration.days;
        const archetypes = this.scenario.archetypes;

        console.log(`HARNESS: Starting Generative Run - ${days} Days for ${this.scenario.scenarioId}`);
        this.clock = 0;

        // Initialize State for Actors based on Archetypes count
        const actors = [];
        for (const [archKey, archSpec] of Object.entries(archetypes)) {
            const count = archSpec.count || 0;
            for (let i = 0; i < count; i++) {
                actors.push(this.generator.spawnActor(`${archKey}-${i + 1}`, archKey, this.randomizer));
            }
        }

        // Initialize Institutional Interface for each actor
        for (const actor of actors) {
            actor.interface = new InstitutionalInterface(this.scenario);
        }

        for (let day = 1; day <= days; day++) {
            if (day % 30 === 0) console.log(`HARNESS: Progress - Day ${day}`);

            for (const actor of actors) {
                // 1. Decide action
                const eventType = this.generator.decide(actor);

                if (eventType && eventType !== 'NO_EVENT') {
                    // 2. Act
                    const payload = this.getPayloadFor(eventType, day);
                    await actor.interface.inject({
                        type: eventType,
                        payload,
                        actorId: actor.id,
                        timestamp: day
                    });

                    // 3. Update Read Model
                    const snapshot = actor.interface.getSnapshot();
                    actor.state = snapshot.state;
                    actor.phase = snapshot.phase;
                    actor.history = snapshot.history;

                    // 4. Record
                    this.recorder.capture(day, eventType, snapshot, actor.id);

                    // 5. Check Invariants
                    this.invariants.check(day, snapshot);
                }
            }

            // 6. Signal Day Completion (Heartbeat for PhaseController)
            for (const actor of actors) {
                await actor.interface.inject({
                    type: 'DAILY_EVALUATION',
                    payload: { day },
                    actorId: actor.id,
                    timestamp: day
                });

                // Update snapshot after daily evaluation
                const snapshot = actor.interface.getSnapshot();
                actor.state = snapshot.state;
                actor.phase = snapshot.phase;
                actor.history = snapshot.history;
            }
        }

        return this.seal();
    }

    getPayloadFor(type, dayOffset) {
        // Base payloads for fitness events
        if (type === 'TRAINING_COMPLETED') return { intensity: 0.7, volume: 0.8, timestamp: dayOffset };
        if (type === 'RECOVERY_COMPLETED') return { quality: 0.9, modality: 'REST', timestamp: dayOffset };
        if (type === 'DISHONEST_LOG') return { fabricatedIntensity: 0.9, actualLoad: 0.3, timestamp: dayOffset };
        if (type === 'INJURY_DECLARED') return { severity: 0.8, mobilityImpact: 0.9, timestamp: dayOffset };

        // Legacy support
        if (type === 'BASELINE_DECLARED') return { assessment: 'I break my deep work promises.' };
        if (type === 'OATH_TAKEN') return { nonNegotiable: '5 min cold shower' };
        if (type === 'GENESIS_VERDICT_SUBMITTED') return { consent: true, why: 'To reclaim focus.' };
        if (type === 'MODULE_ACTIVATED') return { moduleId: 'FITNESS_RECOVERY' };
        return { timestamp: dayOffset };
    }

    seal() {
        const artifact = this.recorder.exportArtifact();
        const report = this.invariants.getReport();
        console.log(`HARNESS: Run Complete. Invariants Passed: ${report.passed}`);
        return { artifact, report };
    }
}
