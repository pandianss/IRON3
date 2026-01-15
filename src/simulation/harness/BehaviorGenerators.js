/**
 * Harness Module: Behavior Generators
 * Role: Generates probabilistic behavior for simulated actors.
 */

import { DecisionEngine } from './DecisionEngine.js';

export class BehaviorGenerator {
    constructor(scenario, randomizer) {
        this.scenario = scenario;
        this.decisionEngine = new DecisionEngine(randomizer);
    }

    /**
     * Decides the next action for an actor based on their archetype and current state.
     * @param {object} actor - { id, archetype, state, phase, history, physiology, behavior }
     * @returns {string} Event type to emit
     */
    decide(actor) {
        const engineId = this.scenario.decisionEngines.FITNESS_DAILY_DECISION_V1 ? 'FITNESS_DAILY_DECISION_V1' : null;

        if (!engineId) {
            throw new Error("No valid decision engine found in scenario.");
        }

        return this.decisionEngine.decide(engineId, {
            standing: actor.state.standing,
            phase: actor.phase?.id || 'GENESIS',
            physiology: actor.physiology,
            behavior: actor.behavior,
            history: actor.history,
            memoryWindow: [], // Placeholder
            authority: {} // Placeholder
        });
    }

    /**
     * Spawns an actor with randomized parameters based on archetype.
     */
    spawnActor(id, archetypeKey, randomizer) {
        const arch = this.scenario.archetypes[archetypeKey];
        if (!arch) throw new Error(`Unknown Archetype: ${archetypeKey}`);

        const physiology = {};
        for (const [key, range] of Object.entries(arch.physiology)) {
            physiology[key] = range[0] + randomizer.random() * (range[1] - range[0]);
        }

        const behavior = {};
        for (const [key, range] of Object.entries(arch.behavior)) {
            behavior[key] = range[0] + randomizer.random() * (range[1] - range[0]);
        }

        return {
            id,
            archetype: archetypeKey,
            physiology,
            behavior,
            state: { standing: { index: 0.5, state: 'STABLE' } },
            phase: { id: 'GENESIS' },
            history: []
        };
    }

    roll(probability) {
        return Math.random() < probability;
    }
}
