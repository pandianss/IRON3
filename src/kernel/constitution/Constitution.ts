import { PrincipleRegistry, Principle } from './Principles';
import { RuleInvariants, SovereignRule } from '../invariants/RuleInvariants';

export class Constitution {
    private principles: PrincipleRegistry;
    private rules: RuleInvariants;

    constructor() {
        this.principles = new PrincipleRegistry();
        this.rules = new RuleInvariants();
        this.initializeLaw();
    }

    private initializeLaw() {
        // Core Principles
        this.principles.register({ id: 'P-GEN-01', text: 'Constitutional Sovereignty', source: 'Constitution Article I', level: 'supreme' });
        this.principles.register({ id: 'P-ACT-01', text: 'Activation Health Requirement', source: 'IRON Charter', level: 'policy', threshold: 80 });
        this.principles.register({ id: 'P-DEG-01', text: 'Critical Degradation Threshold', source: 'IRON Charter', level: 'policy', threshold: 40 });

        // Core Rules
        this.rules.register({
            id: 'R-SYS-01',
            description: 'Actor Provenance Verification',
            logic: (context) => {
                const validActors = new Set([
                    'InstitutionalKernel', // Legacy ref mapping to IronCourt often
                    'IronCourt',           // The True Kernel
                    'AuthorityEngine',     // Internal Chamber
                    'MandateEngine',       // Internal Chamber
                    'SessionEngine',       // Internal Chamber
                    'StandingEngine',      // Internal Chamber
                    'OVERRIDE_ADMIN',      // Emergency Recovery
                    'SimulationHarness',   // Dev Tools
                    'System'               // Automated Process
                ]);

                if (validActors.has(context.action.actor)) return true;

                // DYNAMIC ACTOR VALIDATION
                // 1. Enterprise Users (Must match ID format from AuthContext)
                if (context.action.actor.startsWith('ent_user_') && context.action.actor.length > 10) return true;

                // 2. Sovereign Citizens (Future Proofing)
                if (context.action.actor.startsWith('citizen_') && context.action.actor.length > 10) return true;

                return { allowed: false, reason: `Unrecognized Actor: ${context.action.actor}` };
            }
        });

        this.rules.register({
            id: 'R-SYS-02',
            description: 'Emergency Override',
            logic: (context) => {
                if (context.action.actor === 'OVERRIDE_ADMIN' && context.action.payload.overrideToken === 'SOVEREIGN_RECOVERY') {
                    return { allowed: true, forceAllow: true };
                }
                return true;
            }
        });

        this.rules.register({
            id: 'R-SESS-01',
            description: 'Session State Integrity',
            logic: (context) => {
                if (context.action.type !== 'SESSION_UPDATE_STATUS') return true;
                const current = context.state.domains.session?.status || 'IDLE';
                const target = context.action.payload.status;
                const validTransitions: Record<string, string[]> = {
                    'IDLE': ['PENDING', 'ACTIVE'],
                    'PENDING': ['ACTIVE', 'IDLE'],
                    'ACTIVE': ['IDLE'],
                    'INTERRUPTED': ['ACTIVE', 'IDLE']
                };
                return (target && validTransitions[current]?.includes(target)) || { allowed: false, reason: `Illegal transition ${current}->${target}` };
            }
        });
    }

    public getPrinciples(): Principle[] {
        return this.principles.getAll();
    }

    public getRules(): RuleInvariants {
        return this.rules;
    }
}
