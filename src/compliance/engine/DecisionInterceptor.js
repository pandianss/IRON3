/**
 * Decision Interceptor Module
 * Hooks into system control points to enforce decisions.
 * 
 * Functions:
 * - intercept(actionName, context, ruleIds): Consults the RuleEngine.
 */

import RuleEngine from './RuleEngine.js';

class DecisionInterceptor {
    /**
     * intercept - Checks if an action is allowed based on a set of rules.
     * @param {string} actionName - Name of the action being attempted.
     * @param {Object} context - Context data for the action.
     * @param {Array<string>} ruleIds - List of rule IDs to enforce.
     * @returns {Object} { allowed: boolean, rejectionReasons: [] }
     */
    intercept(actionName, context, ruleIds = []) {
        const results = {
            allowed: true,
            rejectionReasons: []
        };

        for (const ruleId of ruleIds) {
            const decision = RuleEngine.evaluate(ruleId, context);
            if (!decision.allowed) {
                results.allowed = false;
                results.rejectionReasons.push(`[${ruleId}] ${decision.reason}`);
            }
        }

        if (!results.allowed) {
            console.warn(`Action "${actionName}" BLOCKED by Compliance Interceptor:`, results.rejectionReasons);
        }

        return results;
    }
}

export default new DecisionInterceptor();
