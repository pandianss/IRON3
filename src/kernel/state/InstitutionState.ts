import { InstitutionalState, Standing } from '../types';

export class InstitutionalStateModel implements InstitutionalState {
    public standing: Standing;
    public activeLaws: string[];
    public lastUpdate: number;
    public domains: Record<string, any>;

    private STORAGE_KEY = 'IRON_SOVEREIGN_STATE';

    constructor(initialState?: Partial<InstitutionalState>) {
        const defaults = {
            standing: 'UNINDUCTED' as Standing,
            activeLaws: [],
            lastUpdate: Date.now(),
            domains: {
                standing: { state: 'PRE_INDUCTION', integrity: 100, streak: 0 },
                authority: { surfaces: {}, interactionLevel: 'RESTRICTED' },
                mandates: { narrative: { tone: 'GUIDANCE', message: 'SYSTEM BOOTING' }, motion: {}, surfaces: [] },
                phase: { id: 'GENESIS', label: 'GENESIS', version: '1.0' },
                session: { status: 'IDLE', startTime: null, duration: 0 },
                physiology: { health: 100, capacity: 100, load: 0, status: 'OPTIMAL' },
                foundation: { brokenPromise: '', anchorHabits: [], nonNegotiable: '', why: '' },
                foundation: { brokenPromise: '', anchorHabits: [], nonNegotiable: '', why: '' },
                lifecycle: { stage: 'GENESIS', history: [] },
                federation: { enterprises: [], licenses: [] }
            }
        };

        const merged = this._mergeDefaults(defaults, initialState || {});

        this.standing = merged.standing as Standing;
        this.activeLaws = merged.activeLaws;
        this.lastUpdate = merged.lastUpdate;
        this.domains = merged.domains;
    }

    private _mergeDefaults(defaults: any, loaded: any): any {
        if (!loaded) return defaults;
        const merged = { ...defaults };
        Object.keys(loaded).forEach(key => {
            if (loaded[key] && typeof loaded[key] === 'object' && !Array.isArray(loaded[key])) {
                merged[key] = { ...merged[key], ...loaded[key] };
            } else {
                merged[key] = loaded[key];
            }
        });
        return merged;
    }

    public getSnapshot(): InstitutionalState {
        return {
            standing: this.standing,
            activeLaws: [...this.activeLaws],
            lastUpdate: this.lastUpdate,
            domains: JSON.parse(JSON.stringify(this.domains)) // Deep clone for immutability
        };
    }

    public clone(): InstitutionalStateModel {
        return new InstitutionalStateModel(this.getSnapshot());
    }
}
