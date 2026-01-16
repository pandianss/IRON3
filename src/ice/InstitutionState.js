/**
 * ICE Module 4: Institution State
 * Role: Derived Read-Only Model.
 * Cache for quick lookups by Engines.
 */
export class InstitutionState {
    constructor(sovereignToken) {
        this.STORAGE_KEY = 'IRON_INSTITUTION_STATE';
        this.token = sovereignToken;

        // Initial / Default Domains
        const defaults = {
            standing: { state: 'PRE_INDUCTION', integrity: 100, entropy: 0, streak: 0 },
            authority: { surfaces: {}, interactionLevel: 'RESTRICTED' },
            mandates: { narrative: { tone: 'GUIDANCE', message: 'SYSTEM BOOTING' }, motion: {}, surfaces: [] },
            phase: { id: 'GENESIS', label: 'GENESIS', version: '1.0' },
            session: { status: 'INACTIVE', startTime: null, duration: 0 },
            physiology: { health: 100, capacity: 100, load: 0, status: 'OPTIMAL', era: 'PEAK' },
            foundation: { brokenPromise: '', anchorHabits: [], nonNegotiable: '', why: '' },
            lifecycle: { stage: 'GENESIS', history: [], baselineSI: null, baselineEstablishedAt: null }
        };

        // 1. Load from storage
        const loaded = this._load();

        // 2. Deep Merge ensuring Defaults (Schema Migration)
        // If loaded is null, uses defaults. 
        // If loaded is partial, fills in missing keys from defaults.
        this.domains = this._mergeDefaults(defaults, loaded);
    }

    _mergeDefaults(defaults, loaded) {
        if (!loaded) return defaults;
        const merged = { ...defaults };
        Object.keys(loaded).forEach(key => {
            if (loaded[key] && typeof loaded[key] === 'object' && !Array.isArray(loaded[key])) {
                // Recursive merge for domain objects
                merged[key] = { ...merged[key], ...loaded[key] };
            } else {
                merged[key] = loaded[key];
            }
        });
        return merged;
    }

    getDomain(name) {
        if (!this.domains[name]) return null;
        // Return frozen copy to prevent direct mutation
        return Object.freeze({ ...this.domains[name] });
    }

    update(domain, data, token) {
        if (token !== this.token) {
            console.error(`ICE_STATE_DEBUG: Token Mismatch! Expected ${String(this.token)}, Got ${String(token)}`);
            throw new Error("Sovereignty Breach: Unauthorized State Mutation.");
        }

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
        // Shallow freeze of the map
        const snap = { ...this.domains };
        // Deep freeze top level domains?
        Object.keys(snap).forEach(k => {
            if (snap[k] && typeof snap[k] === 'object') {
                snap[k] = Object.freeze({ ...snap[k] });
            }
        });
        return Object.freeze(snap);
    }

    _save() {
        try {
            if (typeof localStorage === 'undefined') return;
            const safeData = JSON.stringify(this.domains, (key, value) => {
                if (key === 'kernel' || key === 'complianceKernel' || key === 'gate' || key === 'monitor') return '[Filtered component]';
                return value;
            });
            localStorage.setItem(this.STORAGE_KEY, safeData);
        } catch (e) {
            console.error("ICE: State Persistence Failure", e);
        }
    }

    _load() {
        try {
            if (typeof localStorage === 'undefined') return null;
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("ICE: State Load Failure", e);
            return null;
        }
    }
}
