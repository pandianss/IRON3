export interface EvidenceRecord {
    id: string;
    timestamp: number;
    blob: any;
    meta: Record<string, any>;
}

export class EvidenceRegistry {
    private evidenceVault: Map<string, EvidenceRecord[]> = new Map();

    /**
     * Attaches evidence to a specific audit log entry (by auditId or hash).
     */
    public attach(auditId: string, evidenceBlob: any, meta: Record<string, any> = {}): string {
        if (!this.evidenceVault.has(auditId)) {
            this.evidenceVault.set(auditId, []);
        }

        const record: EvidenceRecord = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            blob: evidenceBlob,
            meta
        };

        this.evidenceVault.get(auditId)!.push(record);
        return record.id;
    }

    public getEvidence(auditId: string): EvidenceRecord[] {
        return this.evidenceVault.get(auditId) || [];
    }
}
