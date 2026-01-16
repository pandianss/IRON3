/**
 * Constitutional Rule Engine
 * Evaluates rules against actions and state.
 */
export class RuleEngine {
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
        if (ruleId === 'R-SYS-01') {
            const rule = this.rules.get(ruleId);
            console.trace(`DEBUG: evaluate(R-SYS-01) actor='${context.action.actor}' logic='${rule?.logic?.toString()}'`);
        }
        const rule = this.rules.get(ruleId);
        if (!rule) {
            // If rule doesn't exist, is it a pass or fail?
            // In a strict constitutional system, missing rule should probably be an error or passive allowed?
            // For now, allow but warn.
            console.warn(`RuleEngine: Rule ${ruleId} not found.`);
            return { allowed: true, reason: 'Rule not defined', ruleId };
        }

        try {
            const result = rule.logic(context);
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

    /**
     * evaluateActivation - Sovereignty Slice (Phase 2.2)
     * High-level constitutional court for institution activation.
     */
    evaluateActivation(context, state) {
        const action = context.action || {};
        const payload = action.payload || {};

        if (action.type !== 'ACTIVATE_INSTITUTION') return { allowed: true };

        // 1. Health Baseline Check (P-ACT-01 / P-ACT-02)
        const health = payload.health || 0;
        if (health < 80) {
            return {
                allowed: false,
                verdict: 'DENY',
                reason: `Constitutional rejection: Health baseline (80) not met. Current: ${health}`,
                severity: 'CRITICAL',
                degrade: true // Sovereignty Item 2.2: degrade-on-failure
            };
        }

        // 2. Foundation Check (P-ACT-02)
        const foundation = payload.foundation;
        if (!foundation || !foundation.why) {
            return {
                allowed: false,
                verdict: 'HALT',
                reason: 'Constitutional Halt: Institution lacks a valid purpose (Foundation).',
                severity: 'SUPREME'
            };
        }

        return { allowed: true, verdict: 'ALLOW', reason: 'Institutional Birth Approved.' };
    }
}
