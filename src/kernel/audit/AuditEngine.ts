import { Action, SovereignEvent } from '../types';
import { AuditLedger } from './AuditLedger';
import { EvidenceRegistry } from '../evidence/EvidenceRegistry';

export class AuditEngine {
    private ledger: AuditLedger;
    private evidence: EvidenceRegistry;

    constructor() {
        this.ledger = new AuditLedger();
        this.evidence = new EvidenceRegistry();
    }

    /**
     * Formal witnessing of a sovereign act.
     */
    public witness(event: SovereignEvent, actorId: string): string {
        const auditId = this.ledger.record({
            eventId: event.id,
            type: event.type,
            actorId,
            jurisdiction: 'SOVEREIGN_KERNEL'
        });

        console.log(`IRON_AUDIT: Act Witnessed - ${event.type} [AUDIT: ${auditId.substring(0, 8)}]`);
        return auditId;
    }

    public attachEvidence(auditId: string, blob: any, meta: Record<string, any> = {}): void {
        this.evidence.attach(auditId, blob, meta);
    }

    public getAuditTrail() {
        return this.ledger.getLog();
    }

    public verifyIntegrity(): boolean {
        return this.ledger.verify();
    }
}
