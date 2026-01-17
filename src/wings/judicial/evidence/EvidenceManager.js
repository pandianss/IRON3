/**
 * AEL Module 2: Evidence Manager
 * Role: The Archivist.
 * Responsibility: Store and retrieve binary evidence associated with audit logs.
 */
export class EvidenceManager {
    constructor() {
        this.evidenceVault = new Map(); // In-memory for MVP
    }

    /**
     * Attaches evidence to a specific audit log entry (by hash).
     */
    attach(auditHash, evidenceBlob, meta = {}) {
        if (!this.evidenceVault.has(auditHash)) {
            this.evidenceVault.set(auditHash, []);
        }

        const record = {
            id: Math.random().toString(36).substring(7),
            start: new Date().toISOString(),
            blob: evidenceBlob, // In real app, this would be a URL or IPFS hash
            meta
        };

        this.evidenceVault.get(auditHash).push(record);
        return record.id;
    }

    getEvidence(auditHash) {
        return this.evidenceVault.get(auditHash) || [];
    }
}
