/**
 * ICE Module 4: Institution State
 * Role: Derived Read-Only Model.
 * Cache for quick lookups by Engines.
 */
export class InstitutionState {
    constructor() {
        // Domains
        this.domains = {
            standing: { state: 'PRE_INDUCTION', integrity: 0 },
            identity: { role: 'CANDIDATE' },
            temporal: { day: 0, cycle: 'NONE' },
            behavioral: { breaches: 0 },
            authority: { locks: [], surfaces: {} },
            mandates: { surfaces: [], motion: {}, narrative: {} },
            session: { status: 'IDLE', activeContractId: null, startTime: null, venue: null },
            foundation: { brokenPromise: null, startTime: null, anchorHabits: [], nonNegotiable: null, why: null }
        };
    }

    getDomain(name) {
        return this.domains[name];
    }

    update(domain, data) {
        if (!this.domains[domain]) {
            this.domains[domain] = {};
        }
        this.domains[domain] = { ...this.domains[domain], ...data };
    }

    getSnapshot() {
        return { ...this.domains };
    }
}
