/**
 * ICE Module 4: Institution State
 * Role: Derived Read-Only Model.
 * Cache for quick lookups by Engines.
 */
export class InstitutionState {
    constructor() {
        // Domains
        this.domains = {
            standing: { state: 'PRE_INDUCTION', integrity: 100, entropy: 0, streak: 0 },
            authority: { surfaces: {}, interactionLevel: 'RESTRICTED' },
            mandates: { narrative: { tone: 'GUIDANCE', message: 'SYSTEM BOOTING' }, motion: {}, surfaces: [] },
            phase: { id: 'GENESIS', label: 'GENESIS', version: '1.0' },
            session: { status: 'INACTIVE', startTime: null, duration: 0 },
            physiology: { capacity: 100, load: 0, status: 'OPTIMAL', era: 'PEAK' },
            foundation: { brokenPromise: '', anchorHabits: [], nonNegotiable: '', why: '' }
        };
    }

    getDomain(name) {
        return this.domains[name];
    }

    update(domain, data) {
        if (data === null || data === undefined) {
            this.domains[domain] = null;
            return;
        }
        if (!this.domains[domain] || typeof data !== 'object') {
            this.domains[domain] = data;
        } else {
            this.domains[domain] = { ...this.domains[domain], ...data };
        }
    }

    getSnapshot() {
        return { ...this.domains };
    }
}
