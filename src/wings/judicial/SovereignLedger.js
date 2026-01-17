/**
 * SOVEREIGN LEDGER
 * 
 * The immutable record of protocol executions.
 * Implements a local blockchain to store proof of work (Selfies, GPS, Time).
 * 
 * Storage Key: 'IRON_LEDGER_CHAIN'
 */

const STORAGE_KEY = 'IRON_LEDGER_CHAIN';

export const SovereignLedger = {

    /**
     * Retrieve the full chain from storage.
     * Initializes Genesis Block if empty.
     */
    getChain: () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                const genesis = SovereignLedger.createGenesisBlock();
                const chain = [genesis];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(chain));
                return chain;
            }
            return JSON.parse(raw);
        } catch (e) {
            console.error("LEDGER: Chain Corruption Detected.", e);
            return [];
        }
    },

    /**
     * Create the first block in the chain.
     */
    createGenesisBlock: () => {
        return {
            index: 0,
            timestamp: Date.now(),
            data: { message: "GENESIS: SOVEREIGNTY DECLARED" },
            previousHash: "0",
            hash: "0xGENESIS_BLOCK_IRON_PROTOCOL"
        };
    },

    /**
     * Record a verified protocol execution.
     * @param {string} protocolId - The ID of the law executed.
     * @param {Object} proofData - The evidence (photos, gps, tags).
     */
    recordExecution: (protocolId, proofData) => {
        const chain = SovereignLedger.getChain();
        const latestBlock = chain[chain.length - 1];

        const newBlock = {
            index: chain.length,
            timestamp: Date.now(),
            data: {
                protocolId,
                proofs: proofData, // Validated Evidence
                verdict: 'COMPLIANT'
            },
            previousHash: latestBlock.hash
        };

        // Mock Crypto-Hash (Prototype) -> In production use SHA-256
        newBlock.hash = SovereignLedger.calculateHash(newBlock);

        chain.push(newBlock);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chain));

        console.log(`LEDGER: Block #${newBlock.index} mined. Hash: ${newBlock.hash}`);
        return newBlock;
    },

    /**
     * Calculate a hash for the block (Prototype simulation)
     */
    calculateHash: (block) => {
        const str = block.index + block.previousHash + block.timestamp + JSON.stringify(block.data);
        // Using Base64 of the string as a simple unique sig for this prototype
        // In real impl, would be crypto.subtle.digest
        return btoa(str).substring(0, 32) + "...";
    },

    /**
     * Verify the integrity of the chain.
     */
    validateChain: () => {
        const chain = SovereignLedger.getChain();
        for (let i = 1; i < chain.length; i++) {
            const current = chain[i];
            const previous = chain[i - 1];

            if (current.previousHash !== previous.hash) {
                console.error("LEDGER INTEGRITY FAILURE: Chain broken at block " + i);
                return false;
            }
        }
        return true;
    }
};
