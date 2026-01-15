/**
 * Harness Module: Behavior Generators
 * Role: Generates probabilistic behavior for simulated actors.
 * Archetypes:
 * - IRON_WILL: High discipline (95%), High recovery.
 * - CONSISTENT: Good discipline (80%), Good recovery.
 * - STRUGGLING: Low discipline (40%), Low recovery.
 * - TOURIST: Very low discipline (10%), Zero recovery.
 */

export const Archetypes = {
    IRON_WILL: { discipline: 0.98, recovery: 0.95 },
    CONSISTENT: { discipline: 0.85, recovery: 0.70 },
    STRUGGLING: { discipline: 0.40, recovery: 0.30 },
    TOURIST: { discipline: 0.10, recovery: 0.05 }
};

export class BehaviorGenerator {
    constructor(seed = Date.now()) {
        this.seed = seed; // In a real implementation, use a seeded RNG
    }

    /**
     * Decides the next action for an actor based on their archetype and current state.
     * @param {object} actor - { id, archetype, state }
     * @param {object} context - { obligations }
     * @returns {string|null} Event type to emit, or null (inaction)
     */
    decide(actor, context) {
        const profile = Archetypes[actor.archetype];
        if (!profile) throw new Error(`Unknown Archetype: ${actor.archetype}`);

        // State-Dependent Logic
        const standing = actor.state.standing.state;

        // 1. VIOLATED State (The Pit)
        if (standing === 'VIOLATED') {
            // Can only Recover or Quit
            if (this.roll(profile.recovery)) {
                return 'ENTER_RECOVERY';
            }
            return null; // Quitting / Churning
        }

        // 2. RECOVERY State ( Climbing )
        if (standing === 'RECOVERY') {
            // Must Practice to Survive
            if (this.roll(profile.discipline)) {
                return 'PRACTICE_COMPLETE';
            }
            return 'PRACTICE_MISSED';
        }

        // 3. Normal State (PRE_INDUCTION / INDUCTED / COMPLIANT)
        if (standing === 'PRE_INDUCTION') {
            return 'CONTRACT_CREATED'; // Always start
        }

        // Default Daily Choice
        const hasObligation = context.obligations.length > 0 || true; // MVP Assumption
        if (hasObligation) {
            if (this.roll(profile.discipline)) {
                return 'PRACTICE_COMPLETE';
            }
            return 'PRACTICE_MISSED'; // The failure choice
        }

        return null;
    }

    roll(probability) {
        return Math.random() < probability;
    }
}
