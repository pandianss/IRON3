/**
 * IRON — Behavioral Contract DSL
 * Machine-Typed Canonical Schema
 * 
 * This is the legal bytecode of IRON.
 */

// 1. Root Contract Type
export interface InstitutionalContract {
    id: ContractId;
    meta: ContractMeta;
    scope?: ContractScope;
    activation: ActivationClause;
    obligations?: ObligationClause[];
    violations?: ViolationClause[];
    remedies?: RemedyClause[];
    escalations?: EscalationClause[];
    authorityEffects?: AuthorityEffects;
}

// 2. Core Primitives
export type ContractId = string;
export type StandingCode = 'ASCENDING' | 'STABLE' | 'STRAINED' | 'BREACHED' | 'DORMANT';
export type InstitutionalEventType = string;
export type SurfaceId = string;
export type IdentityRole = string;

export type TimeWindow =
    | { cycle: 'DAILY' | 'WEEKLY' | 'CUSTOM' }
    | { withinHours: number }
    | { withinDays: number };

// 3. Meta
export interface ContractMeta {
    version: string;
    description: string;
    author?: string;
    severity: 'CORE' | 'MAJOR' | 'MINOR';
    enforceable: boolean;
}

// 4. Scope
export interface ContractScope {
    actors?: IdentityRole[];
    institutionPhases?: string[];
    surfaces?: SurfaceId[];
}

// 5. Activation Clause
export interface ActivationClause {
    when: ConditionGroup;
}

// 6. Obligation Clause
export interface ObligationClause {
    id: string;
    description?: string;
    requiredEvent: InstitutionalEventType;
    window: TimeWindow;
    tolerance?: {
        lateByHours?: number;
    };
    evidence?: EventEvidenceConstraint;
}

// 7. Violation Clause
export interface ViolationClause {
    id: string;
    when: {
        obligation: string;
        condition: 'expired' | 'contradicted' | 'malformed' | 'falsified';
    };
    emits: InstitutionalEventType;
    weight?: number;
    standingImpact?: StandingDelta;
}

// 8. Remedy Clause
export interface RemedyClause {
    id: string;
    availableWhen?: ConditionGroup;
    requires: EventRequirement[];
    within: TimeWindow;
    effects?: StandingDelta & NarrativeEffect;
}

// 9. Escalation Clause
export interface EscalationClause {
    id: string;
    when: EscalationCondition;
    triggers: EscalationTrigger[];
}

// 10. Authority Effects
export interface AuthorityEffects {
    onActivation?: AuthorityDirective[];
    onViolation?: AuthorityDirective[];
    onRemedy?: AuthorityDirective[];
    onEscalation?: AuthorityDirective[];
}

// 11. Authority Directives
export type AuthorityDirective =
    | AllowDirective
    | RestrictDirective
    | LockDirective;

export interface AllowDirective {
    allow: SurfaceAuthority;
}

export interface RestrictDirective {
    restrict: SurfaceAuthority;
}

export interface LockDirective {
    lock: LockAuthority;
}

// 12. Surface Authority
export interface SurfaceAuthority {
    surface: SurfaceId;
    visibility?: 'VISIBLE' | 'SUPPRESSED' | 'HIDDEN';
    interaction?: 'FULL' | 'GUIDED' | 'RESTRICTED' | 'PROHIBITED';
    expressiveRange?: 'FREE' | 'CONSTRAINED' | 'RITUALIZED';
    motionFreedom?: 'FREE' | 'DAMPENED' | 'CONSTRAINED' | 'FROZEN';
}

// 13. Lock Authority
export interface LockAuthority {
    class: 'INTERACTION' | 'SURFACE' | 'MOTION' | 'NARRATIVE';
    level: string;
    surfaces?: SurfaceId[];
}

// 14. Standing & Narrative Effects
export interface StandingDelta {
    integrityDelta?: number;
    riskVector?: string;
    stabilityDelta?: number;
}

export interface NarrativeEffect {
    narrativeShift?: string;
    symbolicState?: string;
}

// 15. Event Requirements
export interface EventRequirement {
    event: InstitutionalEventType;
    evidence?: EventEvidenceConstraint;
}

// 16. Condition System (Core of the DSL)
export type ConditionGroup =
    | { all: Condition[] }
    | { any: Condition[] }
    | { not: Condition };

export type Condition =
    | StandingCondition
    | TemporalCondition
    | BehavioralCondition
    | IdentityCondition
    | MemoryCondition
    | EventCondition;

// 17. Standing Conditions
export interface StandingCondition {
    standing: {
        is?: StandingCode;
        isNot?: StandingCode;
        integrityAbove?: number;
        integrityBelow?: number;
    };
}

// 18. Temporal Conditions
export interface TemporalCondition {
    temporal: {
        cycle?: 'DAILY' | 'WEEKLY' | 'CUSTOM';
        sinceLastEvent?: {
            type: InstitutionalEventType;
            greaterThanHours?: number;
            lessThanHours?: number;
        };
    };
}

// 19. Behavioral Conditions
export interface BehavioralCondition {
    behavioral: {
        hasActiveContract?: ContractId;
        hasBreach?: string;
        breachCountAbove?: number;
        breachCountWithinDays?: number;
    };
}

// 20. Identity Conditions
export interface IdentityCondition {
    identity: {
        role?: IdentityRole;
        trustLevelAbove?: number;
    };
}

// 21. Memory Conditions
export interface MemoryCondition {
    memory: {
        eventOccurred?: InstitutionalEventType;
        withinDays?: number;
        countAbove?: number;
    };
}

// 22. Event Conditions
export interface EventCondition {
    event: {
        type: InstitutionalEventType;
        payloadMatches?: Record<string, any>;
    };
}

// 23. Event Evidence Constraints
export interface EventEvidenceConstraint {
    fieldsMatch?: Record<string, any>;
    schemaValid?: boolean;
}

// 24. Escalation Conditions
export interface EscalationCondition {
    countOf: string;
    within: TimeWindow;
    greaterThan?: number;
    equals?: number;
}

// 25. Escalation Triggers
export type EscalationTrigger =
    | { activateContract: ContractId }
    | { emitEvent: InstitutionalEventType }
    | { shiftPhase: string };
