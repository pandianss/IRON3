import { SovereignEvent } from '../types';

export class MemoryLedger {
    private _log: SovereignEvent[];
    private _sealed: boolean = false;

    constructor(initialEvents: SovereignEvent[] = []) {
        this._log = [...initialEvents];
    }

    public append(event: SovereignEvent): SovereignEvent {
        if (this._sealed) {
            throw new Error("IRON_VIOLATION: Ledger is sealed.");
        }

        const entry = Object.freeze({ ...event });
        this._log.push(entry);
        return entry;
    }

    public getHistory(): SovereignEvent[] {
        return [...this._log];
    }

    public seal(): void {
        this._sealed = true;
    }

    public get size(): number {
        return this._log.length;
    }

    public query(predicate: (event: SovereignEvent) => boolean): SovereignEvent[] {
        return this._log.filter(predicate);
    }
}
