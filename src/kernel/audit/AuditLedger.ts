export interface AuditBlock {
    index: number;
    timestamp: number;
    data: any;
    prevHash: string;
    hash: string;
}

export class AuditLedger {
    private chain: AuditBlock[] = [];

    constructor() {
        // Genesis Block
        const genesisData = 'GENESIS_AUDIT_LOG';
        const genesisHash = this.calculateHash(0, genesisData, '00000000000000000000000000000000');

        this.chain.push({
            index: 0,
            timestamp: Date.now(),
            data: genesisData,
            prevHash: '00000000000000000000000000000000',
            hash: genesisHash
        });
    }

    public record(entry: any): string {
        const prevBlock = this.chain[this.chain.length - 1];
        const newIndex = prevBlock.index + 1;
        const newHash = this.calculateHash(newIndex, entry, prevBlock.hash);

        const block: AuditBlock = {
            index: newIndex,
            timestamp: Date.now(),
            data: entry,
            prevHash: prevBlock.hash,
            hash: newHash
        };

        this.chain.push(block);
        return block.hash;
    }

    private calculateHash(index: number, data: any, prevHash: string): string {
        const str = index + JSON.stringify(data) + prevHash;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }

    public verify(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const prev = this.chain[i - 1];

            if (current.prevHash !== prev.hash) return false;
            if (current.hash !== this.calculateHash(current.index, current.data, current.prevHash)) return false;
        }
        return true;
    }

    public getLog(): AuditBlock[] {
        return [...this.chain];
    }
}
