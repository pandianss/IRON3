/**
 * AEL Module 1: Audit Logger
 * Role: The Scribe.
 * Responsibility: Maintain an immutable, tamper-evident record of events.
 */
export class AuditLogger {
    constructor() {
        this.chain = [];
        // Genesis Block
        this.chain.push({
            index: 0,
            timestamp: new Date().toISOString(),
            data: 'GENESIS_AUDIT_LOG',
            prevHash: '00000000000000000000000000000000',
            hash: this.calculateHash(0, 'GENESIS_AUDIT_LOG', '00000000000000000000000000000000')
        });
    }

    /**
     * Simple hash function (DJB2 variant or similar for MVP).
     * In production, use SHA-256.
     */
    calculateHash(index, data, prevHash) {
        const str = index + JSON.stringify(data) + prevHash;
        let hash = 0;
        if (str.length === 0) return hash.toString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    /**
     * Logs a new event to the secure chain.
     */
    log(event) {
        const prevBlock = this.chain[this.chain.length - 1];
        const newIndex = prevBlock.index + 1;
        const newHash = this.calculateHash(newIndex, event, prevBlock.hash);

        const block = {
            index: newIndex,
            timestamp: new Date().toISOString(),
            data: event,
            prevHash: prevBlock.hash,
            hash: newHash
        };

        this.chain.push(block);
        return block.hash;
    }

    /**
     * Verifies the integrity of the chain.
     * @returns {boolean} True if chain is valid and untampered.
     */
    verifyIntegrity() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            // 1. Check Linkage
            if (currentBlock.prevHash !== prevBlock.hash) {
                console.error(`AUDIT FAILURE: Chain broken at block ${i}. PrevHash mismatch.`);
                return false;
            }

            // 2. Check Content Integrity (Re-hash)
            const recalcHash = this.calculateHash(currentBlock.index, currentBlock.data, currentBlock.prevHash);
            if (currentBlock.hash !== recalcHash) {
                console.error(`AUDIT FAILURE: Data tampering detected at block ${i}.`);
                return false;
            }
        }
        return true;
    }

    exportLog() {
        return JSON.stringify(this.chain, null, 2);
    }
}
