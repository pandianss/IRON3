/**
 * ICE Module 4: Institution State
 * Role: Derived Read-Only Model.
 * Cache for quick lookups by Engines.
 */
export class InstitutionState {
    constructor() {
        this.STORAGE_KEY = 'IRON_INSTITUTION_STATE';

        // Initial / Default Domains
        const defaults = {
            standing: { state: 'PRE_INDUCTION', integrity: 100, entropy: 0, streak: 0 },
            authority: { surfaces: {}, interactionLevel: 'RESTRICTED' },
            mandates: { narrative: { tone: 'GUIDANCE', message: 'SYSTEM BOOTING' }, motion: {}, surfaces: [] },
            phase: { id: 'GENESIS', label: 'GENESIS', version: '1.0' },
            session: { status: 'INACTIVE', startTime: null, duration: 0 },
            physiology: { capacity: 100, load: 0, status: 'OPTIMAL', era: 'PEAK' },
            foundation: { brokenPromise: '', anchorHabits: [], nonNegotiable: '', why: '' },
            lifecycle: { stage: 'GENESIS', history: [], baselineSI: null, baselineEstablishedAt: null }
        };

        this.domains = this._load() || defaults;
    }

    getDomain(name) {
        return this.domains[name];
    }

    update(domain, data) {
        if (data === null || data === undefined) {
            this.domains[domain] = null;
        } else if (!this.domains[domain] || typeof data !== 'object') {
            this.domains[domain] = data;
        } else {
            this.domains[domain] = { ...this.domains[domain], ...data };
        }

        this._save();
    }

    getSnapshot() {
        return { ...this.domains };
    }

    _save() {
        try {
            const safeData = JSON.stringify(this.domains, (key, value) => {
                if (key === 'kernel' || key === 'complianceKernel' || key === 'gate' || key === 'monitor') return '[Filtered Component]';
                return value;
            });
            localStorage.setItem(this.STORAGE_KEY, safeData);
        } catch (e) {
            console.error("ICE: State Persistence Failure", e);
        }
    }

    _load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("ICE: State Load Failure", e);
            return null;
        }
    }
}
