import { SovereignEvent, Verdict } from '../types';
import { MemoryLedger } from './MemoryLedger';

export interface LedgerEntry {
    event: SovereignEvent;
    verdict: Verdict;
}

export class LedgerAuthority {
    private eventStorage: MemoryLedger;
    private entries: LedgerEntry[] = [];
    private lastHash: string = '00000000000000000000000000000000';

    constructor(initialEvents: SovereignEvent[] = []) {
        this.eventStorage = new MemoryLedger(initialEvents);
    }

    public append(event: SovereignEvent, verdict: Verdict): void {
        const chainedEvent = {
            ...event,
            hash: this.calculateHash(this.entries.length, event, this.lastHash)
        };
        this.lastHash = chainedEvent.hash!;

        this.eventStorage.append(chainedEvent);
        this.entries.push({ event: chainedEvent, verdict });
    }

    private calculateHash(index: number, event: SovereignEvent, prevHash: string): string {
        const str = index + JSON.stringify(event) + prevHash;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }

    public getHistory(): LedgerEntry[] {
        return [...this.entries];
    }
}
