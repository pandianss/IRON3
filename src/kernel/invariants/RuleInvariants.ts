import { Action, InstitutionalState } from '../types';

export interface RuleContext {
    action: Action;
    state: InstitutionalState;
}

export interface RuleResult {
    allowed: boolean;
    reason?: string;
    forceAllow?: boolean;
}

export type RuleLogic = (context: RuleContext) => boolean | RuleResult;

export interface SovereignRule {
    id: string;
    description?: string;
    logic: RuleLogic;
}

export class RuleInvariants {
    private rules: Map<string, SovereignRule> = new Map();

    public register(rule: SovereignRule): void {
        this.rules.set(rule.id, rule);
    }

    public validate(action: Action, state: InstitutionalState): RuleResult {
        const context: RuleContext = { action, state };

        for (const rule of this.rules.values()) {
            const result = rule.logic(context);

            if (typeof result === 'boolean') {
                if (!result) return { allowed: false, reason: `Rule violation: ${rule.id}` };
            } else {
                if (!result.allowed) return result;
                if (result.forceAllow) return { allowed: true };
            }
        }

        return { allowed: true };
    }
}
