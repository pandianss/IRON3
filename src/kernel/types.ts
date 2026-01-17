export type Standing =
    | 'PRE_INDUCTION'
    | 'INDUCTED'
    | 'COMPLIANT'
    | 'STRAINED'
    | 'BREACH_RISK'
    | 'VIOLATED'
    | 'RECOVERY'
    | 'RECONSTITUTED'
    | 'INSTITUTIONAL'
    | 'ELITE'
    | 'COLLAPSED';

export interface SovereignEvent {
    id: string;
    timestamp: number;
    type: string;
    payload: any;
    actor: string;
    hash?: string;
}

export interface InstitutionalState {
    standing: Standing;
    activeLaws: string[];
    lastUpdate: number;
    domains: Record<string, any>;
    history: { event: SovereignEvent, verdict: Verdict }[];
}

export interface Verdict {
    id: string;
    timestamp: number;
    eventId: string;
    consequence: string;
    findings: string[];
    standingTransition?: {
        from: Standing;
        to: Standing;
    };
}

export interface Action {
    type: string;
    payload: any;
    actor: string;
}
