/**
 * Rule Engine Module
 * Evaluates rules against a given context.
 * 
 * Functions:
 * - registerRule(rule): Adds executable logic for a rule.
 * - evaluate(ruleId, context): Returns a decision based on the rule logic.
 * - getRule(ruleId): Retrieves a registered rule.
 */

class RuleEngine {
    constructor() {
        this.rules = new Map();
    }

    /**
     * registerRule - Registers a new rule logic.
     * @param {Object} rule - Rule object { id, logic: (context) => boolean | object, description }
     */
    registerRule(rule) {
        if (!rule.id || typeof rule.logic !== 'function') {
            throw new Error('Invalid rule format. Must have id and logic function.');
        }
        this.rules.set(rule.id, rule);
    }

    /**
     * evaluate - Evaluates a specific rule against a context.
     * @param {string} ruleId - The ID of the rule to evaluate.
     * @param {Object} context - The context data required for evaluation.
     * @returns {Object} { allowed: boolean, reason: string, ruleId: string }
     */
    evaluate(ruleId, context) {
        const rule = this.rules.get(ruleId);
        if (!rule) {
            throw new Error(`Rule ${ruleId} not found.`);
        }

        try {
            const result = rule.logic(context);
            // Normalize result to standard decision object
            if (typeof result === 'boolean') {
                return {
                    allowed: result,
                    reason: result ? 'Rule passed.' : 'Rule failed.',
                    ruleId
                };
            }
            return {
                allowed: result.allowed,
                reason: result.reason || (result.allowed ? 'Rule passed.' : 'Rule failed.'),
                ruleId
            };
        } catch (error) {
            console.error(`Error evaluating rule ${ruleId}:`, error);
            return {
                allowed: false,
                reason: `Runtime error in rule evaluation: ${error.message}`,
                ruleId
            };
        }
    }

    getRule(ruleId) {
        return this.rules.get(ruleId);
    }
}

export default new RuleEngine();
